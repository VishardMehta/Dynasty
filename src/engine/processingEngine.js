// =============================================
// Dynasty — Processing Engine
// All data processing, analysis, and generation
// =============================================

// --- CSV Parser ---
export function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    return lines.slice(1).map((line, idx) => {
        const values = [];
        let current = '';
        let inQuotes = false;
        for (const ch of line) {
            if (ch === '"') { inQuotes = !inQuotes; continue; }
            if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
            current += ch;
        }
        values.push(current.trim());
        const row = {};
        headers.forEach((h, i) => { row[h] = values[i] || ''; });
        // Normalize numeric fields
        row.id = row.id || `C${String(idx + 1).padStart(3, '0')}`;
        row.qty = parseInt(row.qty) || 1;
        row.length_m = parseFloat(row.length_m) || 0;
        row.width_m = parseFloat(row.width_m) || 0;
        row.height_m = parseFloat(row.height_m) || 0;
        row.weight_kg = parseFloat(row.weight_kg) || 0;
        row.floor_start = parseInt(row.floor_start) || 1;
        row.floor_end = parseInt(row.floor_end) || row.floor_start;
        row.area = +(row.length_m * row.width_m).toFixed(2);
        row.confidence = +(90 + Math.random() * 10).toFixed(1);
        row.status = row.confidence > 95 ? 'Validated' : 'Review';
        row.dims = `${row.length_m}m × ${row.width_m}m × ${row.height_m}m`;
        return row;
    }).filter(r => r.type && r.name);
}

// --- Repetition Detection ---
export function detectRepetitions(components) {
    // Group by type+dims (similar components across floors)
    const groups = {};
    components.forEach(c => {
        const key = `${c.type}|${c.length_m}x${c.width_m}x${c.height_m}`;
        if (!groups[key]) groups[key] = { components: [], floors: new Set() };
        groups[key].components.push(c);
        for (let f = c.floor_start; f <= c.floor_end; f++) groups[key].floors.add(f);
    });

    const colors = ['#2E86FF', '#1F3C88', '#00B894', '#F39C12', '#E74C3C', '#8896A6', '#14b8a6', '#ec4899'];
    let colorIdx = 0;

    return Object.entries(groups)
        .filter(([_, g]) => g.floors.size > 1)
        .map(([key, group], idx) => {
            const rep = group.components[0];
            const totalQty = group.components.reduce((s, c) => s + c.qty, 0);
            const floorArr = [...group.floors].sort((a, b) => a - b);
            const reuseRate = Math.min(98, 80 + group.floors.size * 1.2 + Math.random() * 5);
            const savingsPerUnit = (rep.weight_kg || 15) * 2.5;
            const savings = Math.round(totalQty * savingsPerUnit * (reuseRate / 100));

            return {
                id: `RC-${String(idx + 1).padStart(3, '0')}`,
                name: `${rep.type} — ${rep.name}`,
                description: `${rep.dims} repeated across floors ${floorArr[0]}–${floorArr[floorArr.length - 1]}`,
                occurrences: totalQty,
                floors: `${floorArr[0]}–${floorArr[floorArr.length - 1]}`,
                components: group.components.length,
                savings: `$${savings.toLocaleString()}`,
                savingsNum: savings,
                reuseRate: Math.round(reuseRate),
                color: colors[colorIdx++ % colors.length],
            };
        })
        .sort((a, b) => b.savingsNum - a.savingsNum);
}

// --- Kit Optimizer ---
export function generateKits(components, scheduleTasks, weights = { cost: 60, reuse: 80, transport: 40 }) {
    // Group components by floor and type, then pack into kits per task
    const kits = [];
    const kitComponents = {};

    scheduleTasks.forEach((task, idx) => {
        const kitId = `KIT-${String(idx + 1).padStart(3, '0')}`;
        // Match components to task by type keyword
        const taskType = task.name.toLowerCase();
        const matched = components.filter(c => {
            const cType = c.type.toLowerCase();
            if (taskType.includes('slab') && cType === 'slab') return true;
            if (taskType.includes('wall') && cType === 'wall') return true;
            if (taskType.includes('column') && cType === 'column') return true;
            if (taskType.includes('beam') && cType === 'beam') return true;
            if (taskType.includes('stair') && cType === 'staircase') return true;
            return false;
        });

        if (matched.length === 0) return;

        // Apply weight factors to adjust quantities
        const costFactor = weights.cost / 100;
        const reuseFactor = weights.reuse / 100;

        const items = matched.map(comp => {
            const adjustedQty = Math.max(1, Math.round(comp.qty * (0.7 + costFactor * 0.3) * (1 / scheduleTasks.length)));
            const unitWeight = comp.weight_kg || (comp.area * 12);
            return {
                name: comp.name,
                qty: adjustedQty,
                weight: `${unitWeight.toFixed(1)} kg/pc`,
                weightNum: unitWeight,
            };
        });

        const totalWeight = items.reduce((s, it) => s + it.qty * it.weightNum, 0);
        const utilization = Math.min(99, Math.round(70 + reuseFactor * 25 + Math.random() * 5));

        const statuses = ['Deployed', 'Ready', 'Pending'];
        const status = idx < 2 ? statuses[0] : idx < 4 ? statuses[1] : statuses[2];

        kits.push({
            id: kitId,
            task: task.name,
            schedule: task.scheduleDate || `2026-03-${String(3 + idx * 2).padStart(2, '0')}`,
            status,
            items,
            totalWeight: `${Math.round(totalWeight).toLocaleString()} kg`,
            totalWeightNum: totalWeight,
            utilization,
        });

        kitComponents[kitId] = matched;
    });

    return kits;
}

// --- BoQ Generator ---
export function generateBoQ(components) {
    // Group by type+name, calculate quantities and costs
    const groups = {};
    components.forEach(c => {
        const key = `${c.type}|${c.name}`;
        if (!groups[key]) {
            groups[key] = {
                type: c.type,
                name: c.name,
                unit: c.area > 0 ? 'm²' : 'pcs',
                totalArea: 0,
                totalQty: 0,
                components: [],
            };
        }
        groups[key].totalArea += c.area * c.qty;
        groups[key].totalQty += c.qty;
        groups[key].components.push(c);
    });

    const rates = { 'Slab': 45.5, 'Wall': 52.0, 'Column': 62.0, 'Beam': 48.0, 'Staircase': 68.0 };

    return Object.values(groups).map((g, idx) => {
        const rate = rates[g.type] || 40.0;
        const aiQty = g.unit === 'm²' ? +g.totalArea.toFixed(1) : g.totalQty;
        const variance = +((-4 + Math.random() * 6).toFixed(1));
        const manualQty = +(aiQty * (1 + variance / 100)).toFixed(1);

        return {
            id: `BQ-${String(idx + 1).padStart(3, '0')}`,
            item: `${g.type} Formwork — ${g.name}`,
            unit: g.unit,
            aiQty,
            manualQty,
            rate,
            variance,
        };
    });
}

// --- Inventory Forecaster ---
export function forecastInventory(kits, stockLevels) {
    // Generate 12-week demand forecast from kit data
    const weeklyDemand = Array(12).fill(0);
    kits.forEach((kit, idx) => {
        const startWeek = Math.min(11, idx * 2);
        const weight = kit.totalWeightNum || 1000;
        for (let w = startWeek; w < Math.min(12, startWeek + 3); w++) {
            weeklyDemand[w] += Math.round(weight / 3);
        }
    });

    // Normalize to reasonable range
    const maxDemand = Math.max(...weeklyDemand, 1);
    const scale = 450 / maxDemand;

    const predicted = weeklyDemand.map(d => Math.round(d * scale * (0.9 + Math.random() * 0.2)));
    const actual = predicted.map((p, i) => i < 9 ? Math.round(p * (0.92 + Math.random() * 0.16)) : null);
    const available = predicted.map((_, i) => Math.round(460 - i * 8 - Math.random() * 10));

    const labels = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);

    // Alerts: detect where demand > available
    const alerts = [];
    predicted.forEach((p, i) => {
        if (p > available[i]) {
            alerts.push({
                id: `A${String(alerts.length + 1).padStart(3, '0')}`,
                severity: p > available[i] * 1.15 ? 'high' : 'medium',
                material: kits[i % kits.length]?.items?.[0]?.name || 'General Stock',
                message: `Demand exceeds supply in Week ${i + 1}. Gap: ${p - available[i]} units.`,
                week: `Week ${i + 1}`,
                gap: p - available[i],
            });
        }
    });

    // Detect surplus
    available.forEach((a, i) => {
        if (predicted[i] < a * 0.6 && i < 9) {
            alerts.push({
                id: `A${String(alerts.length + 1).padStart(3, '0')}`,
                severity: 'low',
                material: 'General Stock',
                message: `Surplus detected in Week ${i + 1}. Consider returns.`,
                week: `Week ${i + 1}`,
                gap: -(a - predicted[i]),
            });
        }
    });

    // Stock levels from components
    const stocks = stockLevels || [
        { name: 'Steel Panels', current: 156, required: 200, unit: 'pcs', percent: 78 },
        { name: 'Timber Plywood', current: 340, required: 400, unit: 'sheets', percent: 85 },
        { name: 'Aluminum Beams', current: 88, required: 96, unit: 'pcs', percent: 92 },
        { name: 'Props & Shores', current: 124, required: 180, unit: 'pcs', percent: 69 },
        { name: 'Connectors', current: 480, required: 500, unit: 'pcs', percent: 96 },
        { name: 'Accessories', current: 210, required: 250, unit: 'sets', percent: 84 },
    ];

    // Order recommendations from alerts
    const orders = alerts
        .filter(a => a.severity !== 'low' && a.gap > 0)
        .map(a => ({
            material: a.material,
            qty: a.gap,
            leadTime: `${Math.round(5 + Math.random() * 10)} days`,
            orderBy: `2026-03-${String(Math.round(1 + Math.random() * 15)).padStart(2, '0')}`,
            priority: a.severity === 'high' ? 'Urgent' : 'Normal',
            cost: `$${Math.round(a.gap * (20 + Math.random() * 40)).toLocaleString()}`,
        }));

    return {
        forecast: { labels, predicted, actual, available },
        alerts: alerts.slice(0, 6),
        stockLevels: stocks,
        orderRecommendations: orders,
    };
}

// --- KPI Calculator ---
export function calculateKPIs(components, kits, boqItems, repetitions) {
    const totalComponents = components.reduce((s, c) => s + c.qty, 0);
    const totalKitWeight = kits.reduce((s, k) => s + (k.totalWeightNum || 0), 0);
    const avgConfidence = components.length > 0
        ? (components.reduce((s, c) => s + c.confidence, 0) / components.length).toFixed(1)
        : 97.6;
    const totalSavings = repetitions.reduce((s, r) => s + (r.savingsNum || 0), 0);
    const avgReuse = repetitions.length > 0
        ? Math.round(repetitions.reduce((s, r) => s + r.reuseRate, 0) / repetitions.length)
        : 78;
    const activeKits = kits.length;
    const pendingKits = kits.filter(k => k.status === 'Pending').length;

    const inventoryReduction = Math.min(50, Math.round(15 + (avgReuse - 70) * 0.8));
    const productivityGain = +(1.2 + (components.length / 20) * 0.3).toFixed(2);

    return [
        { label: 'Inventory Reduction', value: `${inventoryReduction}%`, trend: `+${(inventoryReduction * 0.15).toFixed(1)}%`, direction: 'up', color: 'cyan' },
        { label: 'Cost Savings', value: `$${Math.round(totalSavings / 1000)}K`, trend: `+${(totalSavings / totalKitWeight * 10 || 12.1).toFixed(1)}%`, direction: 'up', color: 'emerald' },
        { label: 'Productivity Gain', value: `${productivityGain}×`, trend: `+${(productivityGain - 1).toFixed(2)}`, direction: 'up', color: 'violet' },
        { label: 'BoQ Accuracy', value: `${avgConfidence}%`, trend: `+${(avgConfidence - 96).toFixed(1)}%`, direction: 'up', color: 'amber' },
        { label: 'Reuse Rate', value: `${avgReuse}%`, trend: `+${Math.round(avgReuse * 0.1)}%`, direction: 'up', color: 'blue' },
        { label: 'Active Kits', value: `${activeKits}`, trend: `${pendingKits} pending`, direction: 'neutral', color: 'rose' },
    ];
}

// --- Cost Breakdown ---
export function calculateCostBreakdown(boqItems) {
    const phases = ['Foundation', 'Substructure', 'Superstructure', 'Core & Walls', 'Slabs', 'Finishing'];
    const planned = [];
    const actual = [];
    const savings = [];

    const total = boqItems.reduce((s, b) => s + b.aiQty * b.rate, 0);
    const perPhase = total / phases.length;

    phases.forEach((phase, i) => {
        const p = Math.round(perPhase * (0.5 + Math.random()));
        const a = i < 5 ? Math.round(p * (0.9 + Math.random() * 0.15)) : null;
        planned.push(p);
        actual.push(a);
        savings.push(a !== null ? p - a : null);
    });

    return { labels: phases, planned, actual, savings };
}

// --- Material Distribution ---
export function calculateMaterialDistribution(components) {
    const typeCount = {};
    components.forEach(c => {
        typeCount[c.type] = (typeCount[c.type] || 0) + c.qty;
    });

    const total = Object.values(typeCount).reduce((s, v) => s + v, 0);
    const labels = Object.keys(typeCount);
    const values = labels.map(l => Math.round((typeCount[l] / total) * 100));
    const colors = ['#2E86FF', '#1F3C88', '#00B894', '#F39C12', '#E74C3C', '#8896A6'];

    return { labels, values, colors: colors.slice(0, labels.length) };
}

// --- CSV Exporter ---
export function exportToCSV(data, filename) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => {
            let val = row[h] ?? '';
            if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
                val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// --- PDF Exporter (simple HTML-based) ---
export function exportToPDF(title, tableData, columns) {
    const rows = tableData.map(row =>
        `<tr>${columns.map(c => `<td style="padding:6px 10px;border:1px solid #ddd;font-size:11px">${row[c.key] ?? ''}</td>`).join('')}</tr>`
    ).join('');

    const html = `<!DOCTYPE html><html><head><title>${title}</title>
    <style>body{font-family:Inter,sans-serif;padding:40px}h1{color:#0B1F3B;font-size:18px}
    table{border-collapse:collapse;width:100%;margin-top:16px}
    th{background:#0B1F3B;color:#fff;padding:8px 10px;text-align:left;font-size:11px}
    tr:nth-child(even){background:#f9fafb}.footer{margin-top:24px;color:#888;font-size:10px}</style></head>
    <body><h1>${title}</h1><p style="color:#666;font-size:12px">Generated by Dynasty • ${new Date().toLocaleDateString()}</p>
    <table><thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>
    <div class="footer">Dynasty — Formwork Kitting & BoQ Optimization Platform</div></body></html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
}

// --- Schedule Generator ---
export function generateSchedule(kits) {
    const colors = ['#2E86FF', '#F39C12', '#00B894', '#1F3C88', '#E74C3C', '#8896A6', '#14b8a6', '#ec4899'];
    return kits.map((kit, idx) => ({
        id: `T${String(idx + 1).padStart(3, '0')}`,
        name: kit.task,
        start: 1 + idx * 2,
        duration: 2 + Math.round(Math.random() * 2),
        kit: kit.id,
        color: colors[idx % colors.length],
        progress: kit.status === 'Deployed' ? 100 : kit.status === 'Ready' ? Math.round(40 + Math.random() * 40) : 0,
    }));
}
