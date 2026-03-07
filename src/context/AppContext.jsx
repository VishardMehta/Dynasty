import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
    parseCSV,
    detectRepetitions,
    generateKits,
    generateBoQ,
    forecastInventory,
    calculateKPIs,
    calculateCostBreakdown,
    calculateMaterialDistribution,
    generateSchedule,
} from '../engine/processingEngine';
import {
    kpiData, inventoryForecast, costBreakdown, materialDistribution,
    extractedComponents, repetitionClusters, kitDefinitions,
    boqItems, scheduleTasks, activityFeed, inventoryAlerts,
    stockLevels, orderRecommendations, utilizationData, projectInfo,
} from '../data/mockData';
import {
    getProject, saveComponents, loadComponents, saveKits, loadKits,
    saveBoQ, loadBoQ, saveActivity, loadActivities, saveUpload,
    loadLatestUpload, updateKitStatusDB,
} from '../lib/supabaseData';

const AppContext = createContext(null);

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}

export function AppProvider({ children }) {
    // --- State ---
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [projectId, setProjectId] = useState(null);
    const [components, setComponents] = useState([]);
    const [kits, setKits] = useState([]);
    const [boq, setBoq] = useState([]);
    const [repetitions, setRepetitions] = useState([]);
    const [kpis, setKpis] = useState(kpiData);
    const [forecast, setForecast] = useState({ labels: inventoryForecast.labels, predicted: inventoryForecast.predicted, actual: inventoryForecast.actual, available: inventoryForecast.available });
    const [alerts, setAlerts] = useState(inventoryAlerts);
    const [stocks, setStocks] = useState(stockLevels);
    const [orders, setOrders] = useState(orderRecommendations);
    const [costs, setCosts] = useState(costBreakdown);
    const [materials, setMaterials] = useState(materialDistribution);
    const [schedule, setSchedule] = useState(scheduleTasks);
    const [activities, setActivities] = useState(activityFeed);
    const [utilization, setUtilization] = useState(utilizationData);
    const [weights, setWeights] = useState({ cost: 60, reuse: 80, transport: 40 });
    const [uploadInfo, setUploadInfo] = useState(null);

    const processStartRef = useRef(null);

    // --- Load from Supabase on mount ---
    useEffect(() => {
        let cancelled = false;

        async function loadFromDB() {
            try {
                const project = await getProject();
                if (cancelled || !project) { setIsLoading(false); return; }

                setProjectId(project.id);

                // Try loading saved components
                const savedComponents = await loadComponents(project.id);
                if (cancelled) return;

                if (savedComponents.length > 0) {
                    setComponents(savedComponents);

                    // Rebuild all computed data from saved components
                    const reps = detectRepetitions(savedComponents);
                    setRepetitions(reps);

                    // Load kits from DB
                    const savedKits = await loadKits(project.id);
                    if (savedKits.length > 0) {
                        setKits(savedKits);
                    } else {
                        const sched = generateSchedule(kitDefinitions);
                        const genKits = generateKits(savedComponents, sched, weights);
                        setKits(genKits);
                        setSchedule(sched);
                    }

                    // Load BoQ from DB
                    const savedBoQ = await loadBoQ(project.id);
                    if (savedBoQ.length > 0) {
                        setBoq(savedBoQ);
                    } else {
                        const genBoq = generateBoQ(savedComponents);
                        setBoq(genBoq);
                    }

                    // Recalculate derived data
                    const currentKits = savedKits?.length > 0 ? savedKits : kits;
                    const currentBoq = savedBoQ?.length > 0 ? savedBoQ : boq;
                    const invResult = forecastInventory(currentKits, stockLevels);
                    setForecast(invResult.forecast);
                    setAlerts(invResult.alerts);
                    setStocks(invResult.stockLevels);
                    setOrders(invResult.orderRecommendations);

                    const newKpis = calculateKPIs(savedComponents, currentKits, currentBoq, reps);
                    setKpis(newKpis);
                    setCosts(calculateCostBreakdown(currentBoq));
                    setMaterials(calculateMaterialDistribution(savedComponents));

                    setIsDataLoaded(true);
                }

                // Load activities
                const savedActivities = await loadActivities(project.id);
                if (!cancelled && savedActivities.length > 0) {
                    setActivities(savedActivities);
                }

                // Load upload info
                const savedUpload = await loadLatestUpload(project.id);
                if (!cancelled && savedUpload) {
                    setUploadInfo(savedUpload);
                }
            } catch (err) {
                console.error('Failed to load from Supabase:', err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadFromDB();
        return () => { cancelled = true; };
    }, []);

    // --- Actions ---
    const addActivity = useCallback((type, text) => {
        const newActivity = { id: Date.now(), type, text, time: 'Just now' };
        setActivities(prev => [newActivity, ...prev]);
        // Save to Supabase (fire and forget)
        if (projectId) saveActivity(projectId, type, text);
    }, [projectId]);

    const processUpload = useCallback((csvText, fileName, fileSize) => {
        processStartRef.current = performance.now();
        const parsed = parseCSV(csvText);
        if (parsed.length === 0) return { success: false, error: 'No valid components found in CSV' };

        setComponents(parsed);

        // Run all engines
        const reps = detectRepetitions(parsed);
        setRepetitions(reps);

        const sched = generateSchedule(
            kitDefinitions.length > 0
                ? kitDefinitions
                : [{ name: 'Floor 14 — Slab Pour' }, { name: 'Floor 14 — Walls' }, { name: 'Floor 14 — Columns' }, { name: 'Floor 14 — Beams' }, { name: 'Floor 15 — Slab Pour' }]
        );

        const genKits = generateKits(parsed, sched, weights);
        setKits(genKits);
        setSchedule(sched);

        const genBoq = generateBoQ(parsed);
        setBoq(genBoq);

        const invResult = forecastInventory(genKits, stockLevels);
        setForecast(invResult.forecast);
        setAlerts(invResult.alerts);
        setStocks(invResult.stockLevels);
        setOrders(invResult.orderRecommendations);

        const newKpis = calculateKPIs(parsed, genKits, genBoq, reps);
        setKpis(newKpis);

        const newCosts = calculateCostBreakdown(genBoq);
        setCosts(newCosts);

        const newMaterials = calculateMaterialDistribution(parsed);
        setMaterials(newMaterials);

        // Build utilization from kits
        const utilLabels = genKits.map(k => k.id);
        const utilPanels = genKits.map(k => k.items.filter(i => i.name.toLowerCase().includes('panel') || i.name.toLowerCase().includes('slab')).reduce((s, i) => s + i.qty, 0));
        const utilBeams = genKits.map(k => k.items.filter(i => i.name.toLowerCase().includes('beam')).reduce((s, i) => s + i.qty, 0));
        const utilProps = genKits.map(k => k.items.filter(i => i.name.toLowerCase().includes('column') || i.name.toLowerCase().includes('prop')).reduce((s, i) => s + i.qty, 0));
        const utilConnectors = genKits.map(k => k.items.filter(i => i.name.toLowerCase().includes('stair') || i.name.toLowerCase().includes('wall')).reduce((s, i) => s + i.qty, 0));
        setUtilization({ labels: utilLabels, panels: utilPanels, beams: utilBeams, props: utilProps, connectors: utilConnectors });

        const processTime = ((performance.now() - processStartRef.current) / 1000).toFixed(1);
        const info = {
            fileName,
            fileSize: (fileSize / 1024).toFixed(1) + ' KB',
            componentCount: parsed.length,
            totalQty: parsed.reduce((s, c) => s + c.qty, 0),
            processTime: processTime + 's',
            avgConfidence: (parsed.reduce((s, c) => s + c.confidence, 0) / parsed.length).toFixed(1) + '%',
        };
        setUploadInfo(info);
        setIsDataLoaded(true);

        // --- Save to Supabase (async, non-blocking) ---
        if (projectId) {
            saveComponents(projectId, parsed);
            saveKits(projectId, genKits);
            saveBoQ(projectId, genBoq);
            saveUpload(projectId, info);
        }

        // Activity log
        addActivity('cyan', `<strong>BIM Model uploaded</strong> — ${parsed.length} components extracted from ${fileName}`);
        addActivity('emerald', `<strong>${genKits.length} kits</strong> generated with ${weights.cost}% cost / ${weights.reuse}% reuse optimization`);
        addActivity('cyan', `<strong>${genBoq.length} BoQ items</strong> generated — AI accuracy ${(parsed.reduce((s, c) => s + c.confidence, 0) / parsed.length).toFixed(1)}%`);
        addActivity('amber', `<strong>${invResult.alerts.filter(a => a.severity === 'high').length} critical alerts</strong> detected in inventory forecast`);

        return { success: true, count: parsed.length, time: processTime };
    }, [weights, addActivity, projectId]);

    const reoptimizeKits = useCallback((newWeights) => {
        setWeights(newWeights);
        const source = isDataLoaded ? components : extractedComponents;
        const sched = schedule.length > 0 ? schedule : scheduleTasks;
        const genKits = generateKits(source, sched, newWeights);
        setKits(genKits);

        // Recalculate downstream
        const invResult = forecastInventory(genKits, stocks);
        setForecast(invResult.forecast);
        setAlerts(invResult.alerts);
        setOrders(invResult.orderRecommendations);

        const reps = isDataLoaded ? repetitions : detectRepetitions(source);
        const genBoq = isDataLoaded ? boq : generateBoQ(source);
        const newKpis = calculateKPIs(source, genKits, genBoq, reps);
        setKpis(newKpis);

        // Save re-optimized kits to Supabase
        if (projectId) saveKits(projectId, genKits);

        addActivity('cyan', `<strong>Re-optimized ${genKits.length} kits</strong> — Cost: ${newWeights.cost}%, Reuse: ${newWeights.reuse}%, Transport: ${newWeights.transport}%`);
    }, [isDataLoaded, components, schedule, stocks, repetitions, boq, addActivity, projectId]);

    const updateKitStatus = useCallback((kitId, newStatus) => {
        setKits(prev => prev.map(k => k.id === kitId ? { ...k, status: newStatus } : k));
        // Persist to Supabase
        updateKitStatusDB(kitId, newStatus);
        addActivity('emerald', `<strong>${kitId}</strong> status updated to <strong>${newStatus}</strong>`);
    }, [addActivity]);

    // --- Provide everything ---
    const value = {
        // State
        isDataLoaded,
        isLoading,
        components: isDataLoaded ? components : extractedComponents,
        kits: isDataLoaded ? kits : kitDefinitions,
        boq: isDataLoaded ? boq : boqItems,
        repetitions: isDataLoaded ? repetitions : repetitionClusters,
        kpis,
        forecast,
        alerts,
        stocks,
        orders,
        costs,
        materials,
        schedule: isDataLoaded ? schedule : scheduleTasks,
        activities,
        utilization,
        weights,
        uploadInfo,
        projectInfo,
        // Actions
        processUpload,
        reoptimizeKits,
        updateKitStatus,
        addActivity,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
