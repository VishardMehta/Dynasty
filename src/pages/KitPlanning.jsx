import { useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Package, ChevronDown, ChevronUp, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function KitPlanning() {
    const { kits, utilization, weights, reoptimizeKits, updateKitStatus, addActivity } = useApp();
    const [expandedKit, setExpandedKit] = useState(null);
    const [costWeight, setCostWeight] = useState(weights.cost);
    const [reuseWeight, setReuseWeight] = useState(weights.reuse);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleReoptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            reoptimizeKits({ cost: costWeight, reuse: reuseWeight, transport: 100 - costWeight });
            setIsOptimizing(false);
        }, 600);
    };

    const handleSliderChange = (type, value) => {
        if (type === 'cost') setCostWeight(value);
        else setReuseWeight(value);
    };

    const handleStatusToggle = (kit) => {
        const statusOrder = ['Pending', 'Ready', 'Deployed'];
        const currentIdx = statusOrder.indexOf(kit.status);
        const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length];
        updateKitStatus(kit.id, nextStatus);
    };

    const statusIcon = (status) => {
        if (status === 'Deployed') return <CheckCircle size={14} />;
        if (status === 'Ready') return <Clock size={14} />;
        return <AlertCircle size={14} />;
    };

    const statusClass = (status) => {
        if (status === 'Deployed') return 'success';
        if (status === 'Ready') return 'info';
        return 'warning';
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Kit Planning & Optimizer</h1>
                    <div className="subtitle">Optimized formwork kits per scheduled task</div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-primary btn-sm" onClick={handleReoptimize} disabled={isOptimizing}>
                        <RefreshCw size={14} className={isOptimizing ? 'spin' : ''} />
                        {isOptimizing ? 'Optimizing...' : 'Re-optimize All'}
                    </button>
                </div>
            </div>

            <div className="page-content">
                {/* Optimization Controls */}
                <div className="glass-card animate-fade-in-up" style={{ marginBottom: 24 }}>
                    <div className="card-header">
                        <div className="card-title">Optimization Priorities</div>
                        <button className="btn btn-secondary btn-sm" onClick={handleReoptimize} disabled={isOptimizing}>
                            Apply Changes
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                        <div className="range-control">
                            <label>
                                <span>Minimize Cost</span>
                                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{costWeight}%</span>
                            </label>
                            <input type="range" min="0" max="100" value={costWeight}
                                onChange={(e) => handleSliderChange('cost', Number(e.target.value))} />
                        </div>
                        <div className="range-control">
                            <label>
                                <span>Maximize Reuse</span>
                                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{reuseWeight}%</span>
                            </label>
                            <input type="range" min="0" max="100" value={reuseWeight}
                                onChange={(e) => handleSliderChange('reuse', Number(e.target.value))} />
                        </div>
                        <div className="range-control">
                            <label>
                                <span>Minimize Transport</span>
                                <span style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>{100 - costWeight}%</span>
                            </label>
                            <input type="range" min="0" max="100" value={100 - costWeight} readOnly />
                        </div>
                    </div>
                </div>

                {/* Kit Table */}
                <div className="glass-card animate-fade-in-up stagger-2">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Kit Assignments</div>
                            <div className="card-subtitle">{kits.length} kits across scheduled tasks</div>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Kit ID</th><th>Task</th><th>Schedule</th><th>Weight</th>
                                    <th>Utilization</th><th>Status</th><th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {kits.map((kit) => (
                                    <>
                                        <tr key={kit.id} style={{ cursor: 'pointer' }}
                                            onClick={() => setExpandedKit(expandedKit === kit.id ? null : kit.id)}>
                                            <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{kit.id}</td>
                                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{kit.task}</td>
                                            <td>{kit.schedule}</td>
                                            <td>{kit.totalWeight}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ width: 60, height: 6, borderRadius: 3, background: '#E5E8ED' }}>
                                                        <div style={{
                                                            width: `${kit.utilization}%`, height: '100%', borderRadius: 3,
                                                            background: kit.utilization > 90 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                                                            transition: 'width 0.5s ease',
                                                        }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{kit.utilization}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${statusClass(kit.status)}`}
                                                    onClick={(e) => { e.stopPropagation(); handleStatusToggle(kit); }}
                                                    style={{ cursor: 'pointer' }} title="Click to change status">
                                                    {statusIcon(kit.status)} {kit.status}
                                                </span>
                                            </td>
                                            <td>
                                                {expandedKit === kit.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </td>
                                        </tr>
                                        {expandedKit === kit.id && (
                                            <tr key={kit.id + '-detail'}>
                                                <td colSpan={7} style={{ padding: '0 16px 16px' }}>
                                                    <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 16, border: '1px solid var(--border-subtle)' }}>
                                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 10 }}>Kit Contents</div>
                                                        <table className="data-table" style={{ fontSize: '0.82rem' }}>
                                                            <thead><tr><th>Component</th><th>Quantity</th><th>Unit Weight</th></tr></thead>
                                                            <tbody>
                                                                {kit.items.map((item, j) => (
                                                                    <tr key={j}>
                                                                        <td style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                                                                        <td style={{ fontWeight: 600 }}>{item.qty}</td>
                                                                        <td>{item.weight}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Utilization Chart */}
                <div className="glass-card animate-fade-in-up stagger-3" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Component Utilization Across Kits</div>
                            <div className="card-subtitle">Stacked breakdown of formwork usage per kit</div>
                        </div>
                    </div>
                    <div style={{ height: 300 }}>
                        <Bar
                            data={{
                                labels: utilization.labels,
                                datasets: [
                                    { label: 'Panels', data: utilization.panels, backgroundColor: '#00d4ff99', borderRadius: 4, barPercentage: 0.6 },
                                    { label: 'Beams', data: utilization.beams, backgroundColor: '#7c3aed99', borderRadius: 4, barPercentage: 0.6 },
                                    { label: 'Props', data: utilization.props, backgroundColor: '#10b98199', borderRadius: 4, barPercentage: 0.6 },
                                    { label: 'Connectors', data: utilization.connectors, backgroundColor: '#f59e0b99', borderRadius: 4, barPercentage: 0.6 },
                                ],
                            }}
                            options={{
                                responsive: true, maintainAspectRatio: false,
                                plugins: {
                                    legend: { labels: { color: '#5A6A7E', font: { family: 'Inter', size: 11 } } },
                                    tooltip: { backgroundColor: '#0B1F3B', titleColor: '#FFFFFF', bodyColor: '#C4CAD4', borderColor: 'rgba(46,134,255,0.2)', borderWidth: 1, cornerRadius: 8, padding: 12 },
                                },
                                scales: {
                                    x: { stacked: true, ticks: { color: '#5A6A7E', font: { size: 10 } }, grid: { display: false } },
                                    y: { stacked: true, ticks: { color: '#5A6A7E', font: { size: 10 } }, grid: { color: '#E5E8ED' } },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
