// =============================================
// Dynasty — Mock Data Module
// All simulated AI/ML outputs for the prototype
// =============================================

// --- Project Info ---
export const projectInfo = {
    name: 'Marina Bay Tower — Phase 2',
    location: 'Singapore',
    client: 'Ascend Developments Pte. Ltd.',
    contractor: 'BuildCorp International',
    totalFloors: 28,
    currentFloor: 14,
    startDate: '2025-03-15',
    estimatedEnd: '2027-06-30',
    completionPercent: 42,
    totalBudget: 18500000,
    formworkBudget: 1480000,
};

// --- KPI Data ---
export const kpiData = [
    { label: 'Inventory Reduction', value: '32%', trend: '+5.2%', direction: 'up', color: 'cyan' },
    { label: 'Cost Savings', value: '$284K', trend: '+12.1%', direction: 'up', color: 'emerald' },
    { label: 'Productivity Gain', value: '1.89×', trend: '+0.14', direction: 'up', color: 'violet' },
    { label: 'BoQ Accuracy', value: '97.6%', trend: '+1.2%', direction: 'up', color: 'amber' },
    { label: 'Reuse Rate', value: '78%', trend: '+8%', direction: 'up', color: 'blue' },
    { label: 'Active Kits', value: '24', trend: '3 pending', direction: 'neutral', color: 'rose' },
];

// --- Inventory Forecast (time-series) ---
export const inventoryForecast = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
    predicted: [420, 390, 370, 410, 380, 350, 320, 340, 310, 290, 270, 260],
    actual: [420, 400, 385, 395, 375, 360, 335, 330, 305, null, null, null],
    available: [450, 450, 440, 440, 430, 420, 410, 400, 390, 380, 370, 360],
};

// --- Cost Breakdown ---
export const costBreakdown = {
    labels: ['Foundation', 'Substructure', 'Superstructure', 'Core & Walls', 'Slabs', 'Finishing'],
    planned: [120000, 95000, 280000, 210000, 340000, 85000],
    actual: [115000, 98000, 265000, 195000, 310000, null],
    savings: [5000, -3000, 15000, 15000, 30000, null],
};

// --- Material Distribution ---
export const materialDistribution = {
    labels: ['Steel Panels', 'Timber Plywood', 'Aluminum Frames', 'Props & Shores', 'Connectors', 'Accessories'],
    values: [28, 22, 18, 16, 10, 6],
    colors: ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'],
};

// --- Extracted BIM Components ---
export const extractedComponents = [
    { id: 'C001', type: 'Slab', name: 'Typical Floor Slab', dims: '12.0m × 8.5m × 0.25m', qty: 28, area: 102.0, confidence: 98.5, status: 'Validated' },
    { id: 'C002', type: 'Wall', name: 'Shear Wall SW-1', dims: '6.0m × 3.2m × 0.30m', qty: 56, area: 19.2, confidence: 97.2, status: 'Validated' },
    { id: 'C003', type: 'Wall', name: 'Partition Wall PW-A', dims: '4.5m × 3.0m × 0.15m', qty: 112, area: 13.5, confidence: 96.8, status: 'Validated' },
    { id: 'C004', type: 'Beam', name: 'Main Beam MB-1', dims: '8.5m × 0.6m × 0.4m', qty: 84, area: 5.1, confidence: 99.1, status: 'Validated' },
    { id: 'C005', type: 'Beam', name: 'Secondary Beam SB-2', dims: '4.2m × 0.4m × 0.3m', qty: 168, area: 1.68, confidence: 95.4, status: 'Review' },
    { id: 'C006', type: 'Column', name: 'Column C1 (600×600)', dims: '0.6m × 0.6m × 3.2m', qty: 196, area: 7.68, confidence: 99.3, status: 'Validated' },
    { id: 'C007', type: 'Column', name: 'Column C2 (450×450)', dims: '0.45m × 0.45m × 3.2m', qty: 84, area: 5.76, confidence: 98.7, status: 'Validated' },
    { id: 'C008', type: 'Staircase', name: 'Stair Flight SF-1', dims: '3.5m × 1.2m × 0.18m', qty: 56, area: 4.2, confidence: 93.1, status: 'Review' },
    { id: 'C009', type: 'Slab', name: 'Cantilever Slab CS-1', dims: '2.0m × 8.5m × 0.20m', qty: 14, area: 17.0, confidence: 94.6, status: 'Review' },
    { id: 'C010', type: 'Wall', name: 'Lift Core Wall LC-1', dims: '2.5m × 3.2m × 0.25m', qty: 112, area: 8.0, confidence: 97.9, status: 'Validated' },
];

// --- Repetition Clusters ---
export const repetitionClusters = [
    {
        id: 'RC-001', name: 'Typical Floor Slab Layout',
        description: 'Identical slab formwork across floors 3–26',
        occurrences: 24, floors: '3–26', components: 6,
        savings: '$42,000', reuseRate: 96, color: '#00d4ff',
    },
    {
        id: 'RC-002', name: 'Standard Shear Wall Pair',
        description: 'Matching shear wall pairs (SW-1/SW-2)',
        occurrences: 48, floors: '1–24', components: 4,
        savings: '$28,500', reuseRate: 92, color: '#7c3aed',
    },
    {
        id: 'RC-003', name: 'Column Grid Pattern A',
        description: '600×600 columns on 6m grid (Zone A)',
        occurrences: 168, floors: '1–28', components: 2,
        savings: '$18,200', reuseRate: 98, color: '#10b981',
    },
    {
        id: 'RC-004', name: 'Main Beam Assembly',
        description: '8.5m span beams with drop panels',
        occurrences: 72, floors: '3–26', components: 3,
        savings: '$15,600', reuseRate: 88, color: '#f59e0b',
    },
    {
        id: 'RC-005', name: 'Partition Wall Module',
        description: 'Repeating partition layout per unit',
        occurrences: 96, floors: '5–26', components: 8,
        savings: '$22,400', reuseRate: 85, color: '#f43f5e',
    },
    {
        id: 'RC-006', name: 'Stair Core Assembly',
        description: 'Standard staircase formwork set',
        occurrences: 26, floors: '2–27', components: 5,
        savings: '$8,900', reuseRate: 94, color: '#3b82f6',
    },
    {
        id: 'RC-007', name: 'Balcony Slab Cantilever',
        description: 'Identical balcony projections (east & west)',
        occurrences: 44, floors: '5–26', components: 3,
        savings: '$11,300', reuseRate: 91, color: '#ec4899',
    },
    {
        id: 'RC-008', name: 'Lift Core Formwork',
        description: 'Climbing formwork for lift shaft',
        occurrences: 28, floors: '1–28', components: 4,
        savings: '$6,800', reuseRate: 97, color: '#14b8a6',
    },
];

// --- Repetition Heatmap Data (Floors × Component Types) ---
export const repetitionHeatmap = {
    floors: Array.from({ length: 10 }, (_, i) => `Floor ${i + 3}`),
    types: ['Slabs', 'Walls', 'Beams', 'Columns', 'Stairs'],
    data: [
        [96, 92, 88, 98, 94],
        [96, 92, 88, 98, 94],
        [96, 91, 87, 98, 94],
        [95, 90, 86, 97, 93],
        [96, 92, 88, 98, 94],
        [96, 92, 88, 98, 94],
        [95, 89, 85, 97, 93],
        [96, 92, 88, 98, 94],
        [96, 92, 87, 98, 94],
        [94, 88, 84, 96, 92],
    ],
};

// --- Kit Definitions ---
export const kitDefinitions = [
    {
        id: 'KIT-001', task: 'Floor 14 — Slab Pour (Zone A)',
        schedule: '2026-03-05', status: 'Ready',
        items: [
            { name: 'Steel Panel 2400×600', qty: 48, weight: '28.8 kg/pc' },
            { name: 'Steel Panel 1200×600', qty: 24, weight: '14.4 kg/pc' },
            { name: 'Aluminum Beam H20 — 3.9m', qty: 32, weight: '9.1 kg/pc' },
            { name: 'Drop Head Prop 2.5–4.0m', qty: 64, weight: '12.5 kg/pc' },
            { name: 'Panel Connector Clip', qty: 96, weight: '0.3 kg/pc' },
        ],
        totalWeight: '2,842 kg', utilization: 94,
    },
    {
        id: 'KIT-002', task: 'Floor 14 — Shear Walls (Core)',
        schedule: '2026-03-07', status: 'Ready',
        items: [
            { name: 'Wall Panel 2700×600', qty: 24, weight: '37.5 kg/pc' },
            { name: 'Wall Panel 1350×600', qty: 12, weight: '18.8 kg/pc' },
            { name: 'Push-Pull Prop 3.5m', qty: 18, weight: '15.2 kg/pc' },
            { name: 'Tie Rod M20 0.4m', qty: 36, weight: '1.8 kg/pc' },
        ],
        totalWeight: '1,476 kg', utilization: 88,
    },
    {
        id: 'KIT-003', task: 'Floor 14 — Columns (Grid A–E)',
        schedule: '2026-03-03', status: 'Deployed',
        items: [
            { name: 'Column Form 600×600 — 3.2m', qty: 14, weight: '68.0 kg/pc' },
            { name: 'Column Clamp Set', qty: 14, weight: '22.0 kg/pc' },
            { name: 'Alignment Prop', qty: 28, weight: '8.5 kg/pc' },
        ],
        totalWeight: '1,498 kg', utilization: 96,
    },
    {
        id: 'KIT-004', task: 'Floor 14 — Beams (Zone A)',
        schedule: '2026-03-04', status: 'Deployed',
        items: [
            { name: 'Beam Bottom Panel 8.5m', qty: 6, weight: '45.0 kg/pc' },
            { name: 'Beam Side Panel 8.5×0.6m', qty: 12, weight: '32.0 kg/pc' },
            { name: 'Beam Prop Assembly', qty: 12, weight: '18.5 kg/pc' },
        ],
        totalWeight: '876 kg', utilization: 91,
    },
    {
        id: 'KIT-005', task: 'Floor 15 — Slab Pour (Zone A)',
        schedule: '2026-03-18', status: 'Pending',
        items: [
            { name: 'Steel Panel 2400×600', qty: 48, weight: '28.8 kg/pc' },
            { name: 'Steel Panel 1200×600', qty: 24, weight: '14.4 kg/pc' },
            { name: 'Aluminum Beam H20 — 3.9m', qty: 32, weight: '9.1 kg/pc' },
            { name: 'Drop Head Prop 2.5–4.0m', qty: 64, weight: '12.5 kg/pc' },
            { name: 'Panel Connector Clip', qty: 96, weight: '0.3 kg/pc' },
        ],
        totalWeight: '2,842 kg', utilization: 94,
    },
    {
        id: 'KIT-006', task: 'Floor 15 — Shear Walls (Core)',
        schedule: '2026-03-20', status: 'Pending',
        items: [
            { name: 'Wall Panel 2700×600', qty: 24, weight: '37.5 kg/pc' },
            { name: 'Wall Panel 1350×600', qty: 12, weight: '18.8 kg/pc' },
            { name: 'Push-Pull Prop 3.5m', qty: 18, weight: '15.2 kg/pc' },
            { name: 'Tie Rod M20 0.4m', qty: 36, weight: '1.8 kg/pc' },
        ],
        totalWeight: '1,476 kg', utilization: 88,
    },
];

// --- Inventory Alerts ---
export const inventoryAlerts = [
    { id: 'A001', severity: 'high', material: 'Drop Head Prop 2.5–4.0m', message: 'Stock falls below demand in Week 8. Order 40 units.', week: 'Week 8', gap: 40 },
    { id: 'A002', severity: 'medium', material: 'Steel Panel 2400×600', message: 'Tight supply from Week 10. Reserve or order 20 units.', week: 'Week 10', gap: 20 },
    { id: 'A003', severity: 'low', material: 'Aluminum Beam H20 — 3.9m', message: 'Minor surplus detected. Possible return 12 units after Week 6.', week: 'Week 6', gap: -12 },
    { id: 'A004', severity: 'high', material: 'Wall Panel 2700×600', message: 'Projected shortage in Week 9. Source from partner yard.', week: 'Week 9', gap: 16 },
    { id: 'A005', severity: 'medium', material: 'Tie Rod M20 0.4m', message: 'Consumption rate 15% above forecast. Increase next order.', week: 'Week 7', gap: 25 },
];

// --- Stock Levels ---
export const stockLevels = [
    { name: 'Steel Panels', current: 156, required: 200, unit: 'pcs', percent: 78 },
    { name: 'Timber Plywood', current: 340, required: 400, unit: 'sheets', percent: 85 },
    { name: 'Aluminum Beams', current: 88, required: 96, unit: 'pcs', percent: 92 },
    { name: 'Props & Shores', current: 124, required: 180, unit: 'pcs', percent: 69 },
    { name: 'Connectors', current: 480, required: 500, unit: 'pcs', percent: 96 },
    { name: 'Accessories', current: 210, required: 250, unit: 'sets', percent: 84 },
];

// --- BoQ Items ---
export const boqItems = [
    { id: 'BQ-001', item: 'Slab Formwork — Steel Panel System', unit: 'm²', aiQty: 2856.0, manualQty: 2900.0, rate: 45.5, variance: -1.5 },
    { id: 'BQ-002', item: 'Wall Formwork — Modular Panel', unit: 'm²', aiQty: 1075.2, manualQty: 1100.0, rate: 52.0, variance: -2.3 },
    { id: 'BQ-003', item: 'Column Formwork — Steel System', unit: 'm²', aiQty: 1505.3, manualQty: 1480.0, rate: 62.0, variance: 1.7 },
    { id: 'BQ-004', item: 'Beam Formwork — Timber + Steel', unit: 'm²', aiQty: 428.4, manualQty: 440.0, rate: 48.0, variance: -2.6 },
    { id: 'BQ-005', item: 'Staircase Formwork', unit: 'm²', aiQty: 235.2, manualQty: 242.0, rate: 68.0, variance: -2.8 },
    { id: 'BQ-006', item: 'Cantilever Slab Formwork', unit: 'm²', aiQty: 238.0, manualQty: 245.0, rate: 55.0, variance: -2.9 },
    { id: 'BQ-007', item: 'Drop Head Props 2.5–4.0m', unit: 'pcs', aiQty: 1792, manualQty: 1800, rate: 28.5, variance: -0.4 },
    { id: 'BQ-008', item: 'Aluminum H20 Beams 3.9m', unit: 'pcs', aiQty: 896, manualQty: 910, rate: 42.0, variance: -1.5 },
    { id: 'BQ-009', item: 'Panel Connectors & Clips', unit: 'sets', aiQty: 2688, manualQty: 2750, rate: 3.5, variance: -2.3 },
    { id: 'BQ-010', item: 'Push-Pull Props 3.5m', unit: 'pcs', aiQty: 504, manualQty: 520, rate: 35.0, variance: -3.1 },
    { id: 'BQ-011', item: 'Tie Rods M20 — 0.4m', unit: 'pcs', aiQty: 1008, manualQty: 1020, rate: 8.5, variance: -1.2 },
    { id: 'BQ-012', item: 'Column Clamp Sets', unit: 'sets', aiQty: 392, manualQty: 400, rate: 22.0, variance: -2.0 },
];

// --- Schedule / Gantt Tasks ---
export const scheduleTasks = [
    { id: 'T001', name: 'Floor 14 — Columns', start: 1, duration: 3, kit: 'KIT-003', color: '#7c3aed', progress: 100 },
    { id: 'T002', name: 'Floor 14 — Beams', start: 3, duration: 3, kit: 'KIT-004', color: '#f59e0b', progress: 100 },
    { id: 'T003', name: 'Floor 14 — Slab (Zone A)', start: 5, duration: 4, kit: 'KIT-001', color: '#00d4ff', progress: 75 },
    { id: 'T004', name: 'Floor 14 — Walls (Core)', start: 6, duration: 3, kit: 'KIT-002', color: '#10b981', progress: 40 },
    { id: 'T005', name: 'Floor 14 — Slab (Zone B)', start: 8, duration: 4, kit: 'KIT-005', color: '#3b82f6', progress: 0 },
    { id: 'T006', name: 'Floor 14 — Stairs', start: 9, duration: 2, kit: null, color: '#f43f5e', progress: 0 },
    { id: 'T007', name: 'Floor 15 — Columns', start: 10, duration: 3, kit: null, color: '#7c3aed', progress: 0 },
    { id: 'T008', name: 'Floor 15 — Beams', start: 12, duration: 3, kit: null, color: '#f59e0b', progress: 0 },
    { id: 'T009', name: 'Floor 15 — Slab (Zone A)', start: 14, duration: 4, kit: 'KIT-005', color: '#00d4ff', progress: 0 },
    { id: 'T010', name: 'Floor 15 — Walls (Core)', start: 15, duration: 3, kit: 'KIT-006', color: '#10b981', progress: 0 },
];

// --- Activity Feed ---
export const activityFeed = [
    { id: 1, type: 'cyan', text: '<strong>KIT-001</strong> generated for Floor 14 Slab Pour (Zone A)', time: '2 hours ago' },
    { id: 2, type: 'emerald', text: '<strong>KIT-003</strong> deployed — all column forms in position', time: '4 hours ago' },
    { id: 3, type: 'amber', text: 'Shortage alert: <strong>Drop Head Props</strong> projected for Week 8', time: '6 hours ago' },
    { id: 4, type: 'rose', text: 'Design change detected on Floor 18 — <strong>BoQ recalculated</strong>', time: '1 day ago' },
    { id: 5, type: 'cyan', text: '<strong>Repetition cluster RC-005</strong> updated — 4 new occurrences found', time: '1 day ago' },
    { id: 6, type: 'emerald', text: 'BoQ export completed — <strong>12 items, 97.6% accuracy</strong>', time: '2 days ago' },
    { id: 7, type: 'amber', text: 'Inventory recount triggered for <strong>Steel Panels</strong>', time: '2 days ago' },
    { id: 8, type: 'cyan', text: 'AI model retrained — prediction accuracy improved to <strong>96.8%</strong>', time: '3 days ago' },
];

// --- Utilization Chart Data ---
export const utilizationData = {
    labels: ['KIT-001', 'KIT-002', 'KIT-003', 'KIT-004', 'KIT-005', 'KIT-006'],
    panels: [48, 36, 0, 18, 48, 36],
    beams: [32, 0, 0, 12, 32, 0],
    props: [64, 18, 28, 12, 64, 18],
    connectors: [96, 36, 14, 0, 96, 36],
};

// --- Order Recommendations ---
export const orderRecommendations = [
    { material: 'Drop Head Prop 2.5–4.0m', qty: 40, leadTime: '10 days', orderBy: '2026-02-23', priority: 'Urgent', cost: '$1,140' },
    { material: 'Wall Panel 2700×600', qty: 16, leadTime: '14 days', orderBy: '2026-02-19', priority: 'Urgent', cost: '$2,400' },
    { material: 'Steel Panel 2400×600', qty: 20, leadTime: '7 days', orderBy: '2026-03-01', priority: 'Normal', cost: '$1,820' },
    { material: 'Tie Rod M20 0.4m', qty: 25, leadTime: '5 days', orderBy: '2026-03-03', priority: 'Normal', cost: '$213' },
];
