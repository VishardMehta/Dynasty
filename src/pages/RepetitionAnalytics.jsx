import { useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Layers, TrendingUp, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RepetitionAnalytics() {
    const { repetitions, isDataLoaded, addActivity } = useApp();
    const [selectedCluster, setSelectedCluster] = useState(null);

    const totalSavings = repetitions.reduce((s, r) => s + (r.savingsNum || 0), 0);
    const avgReuse = repetitions.length > 0
        ? Math.round(repetitions.reduce((s, r) => s + r.reuseRate, 0) / repetitions.length)
        : 0;

    const handleClusterClick = (cluster) => {
        setSelectedCluster(selectedCluster?.id === cluster.id ? null : cluster);
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Repetition Analytics</h1>
                    <div className="subtitle">Identify repeating design patterns for maximum formwork reuse</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {isDataLoaded && <span className="badge success">Live Data</span>}
                    <span className="badge info">{repetitions.length} clusters detected</span>
                </div>
            </div>

            <div className="page-content">
                {/* KPI Row */}
                <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
                    <div className="kpi-card cyan animate-fade-in-up stagger-1">
                        <div className="kpi-icon"><Layers size={20} /></div>
                        <div className="kpi-label">Pattern Clusters</div>
                        <div className="kpi-value">{repetitions.length}</div>
                        <div className="kpi-trend up">auto-detected from geometry</div>
                    </div>
                    <div className="kpi-card emerald animate-fade-in-up stagger-2">
                        <div className="kpi-icon"><TrendingUp size={20} /></div>
                        <div className="kpi-label">Total Savings</div>
                        <div className="kpi-value">${Math.round(totalSavings / 1000)}K</div>
                        <div className="kpi-trend up">from reuse across floors</div>
                    </div>
                    <div className="kpi-card violet animate-fade-in-up stagger-3">
                        <div className="kpi-icon"><RefreshCw size={20} /></div>
                        <div className="kpi-label">Avg Reuse Rate</div>
                        <div className="kpi-value">{avgReuse}%</div>
                        <div className="kpi-trend up">across all clusters</div>
                    </div>
                </div>

                <div className="grid-2-1">
                    {/* Cluster Cards */}
                    <div className="glass-card animate-fade-in-up stagger-2">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Repetition Clusters</div>
                                <div className="card-subtitle">Click a cluster for details</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {repetitions.map((cluster) => (
                                <div key={cluster.id} style={{
                                    padding: '14px 16px', borderRadius: 10,
                                    background: selectedCluster?.id === cluster.id ? 'rgba(46,134,255,0.06)' : '#F8FAFC',
                                    border: selectedCluster?.id === cluster.id ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                }} onClick={() => handleClusterClick(cluster)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{cluster.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{cluster.description}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>{cluster.savings}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cluster.occurrences} occurrences</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.8rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Reuse Rate</span>
                                        <span style={{ fontWeight: 600, color: cluster.color }}>{cluster.reuseRate}%</span>
                                    </div>
                                    <div style={{ height: 4, borderRadius: 2, background: '#E5E8ED', marginTop: 4 }}>
                                        <div style={{ width: `${cluster.reuseRate}%`, height: '100%', borderRadius: 2, background: cluster.color, transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Savings Chart */}
                    <div className="glass-card animate-fade-in-up stagger-3">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Savings by Cluster</div>
                                <div className="card-subtitle">Estimated cost reduction from reuse</div>
                            </div>
                        </div>
                        <div style={{ height: 300 }}>
                            <Bar
                                data={{
                                    labels: repetitions.map(r => r.id),
                                    datasets: [{
                                        label: 'Savings ($)',
                                        data: repetitions.map(r => r.savingsNum),
                                        backgroundColor: repetitions.map(r => r.color + '99'),
                                        borderRadius: 6,
                                        barPercentage: 0.6,
                                    }],
                                }}
                                options={{
                                    responsive: true, maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: { backgroundColor: '#0B1F3B', titleColor: '#FFFFFF', bodyColor: '#C4CAD4', borderColor: 'rgba(46,134,255,0.2)', borderWidth: 1, cornerRadius: 8, padding: 12 },
                                    },
                                    scales: {
                                        x: { ticks: { color: '#5A6A7E', font: { size: 9 } }, grid: { display: false } },
                                        y: { ticks: { color: '#5A6A7E', font: { size: 10 }, callback: v => '$' + (v / 1000) + 'K' }, grid: { color: '#E5E8ED' } },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Selected Cluster Detail */}
                {selectedCluster && (
                    <div className="glass-card animate-fade-in-up" style={{ marginTop: 24 }}>
                        <div className="card-header">
                            <div>
                                <div className="card-title">Cluster Detail — {selectedCluster.id}</div>
                                <div className="card-subtitle">{selectedCluster.name}</div>
                            </div>
                            <span className="badge info">Floors {selectedCluster.floors}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Occurrences</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCluster.occurrences}</div>
                            </div>
                            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reuse Rate</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: selectedCluster.color }}>{selectedCluster.reuseRate}%</div>
                            </div>
                            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Savings</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{selectedCluster.savings}</div>
                            </div>
                            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Components</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCluster.components}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
