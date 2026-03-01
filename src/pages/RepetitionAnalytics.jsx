import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Layers, Copy, TrendingUp, ArrowRight } from 'lucide-react';
import { repetitionClusters, repetitionHeatmap } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RepetitionAnalytics() {
    const totalSavings = repetitionClusters.reduce((sum, c) => {
        return sum + parseInt(c.savings.replace(/[^0-9]/g, ''));
    }, 0);

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Repetition Analytics</h1>
                    <div className="subtitle">Detect and exploit repeating formwork patterns for maximum reuse</div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <span className="badge info">{repetitionClusters.length} Clusters Found</span>
                    <span className="badge success">${totalSavings.toLocaleString()} Potential Savings</span>
                </div>
            </div>

            <div className="page-content">
                {/* Cluster Cards */}
                <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    {repetitionClusters.map((cluster, i) => (
                        <div key={cluster.id} className="glass-card animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8,
                                        background: `${cluster.color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Layers size={18} style={{ color: cluster.color }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cluster.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cluster.id}</div>
                                    </div>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
                                {cluster.description}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <div><Copy size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{cluster.occurrences} occurrences</div>
                                <div>Floors {cluster.floors}</div>
                                <div>{cluster.components} components</div>
                                <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{cluster.savings} saved</div>
                            </div>
                            {/* Reuse Bar */}
                            <div style={{ marginTop: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Reuse Rate</span>
                                    <span style={{ fontWeight: 600, color: cluster.color }}>{cluster.reuseRate}%</span>
                                </div>
                                <div style={{ height: 4, borderRadius: 2, background: '#E5E8ED' }}>
                                    <div style={{
                                        width: `${cluster.reuseRate}%`, height: '100%',
                                        borderRadius: 2, background: cluster.color,
                                        transition: 'width 0.8s ease',
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid-2" style={{ marginTop: 8 }}>
                    {/* Reuse Savings Bar Chart */}
                    <div className="glass-card animate-fade-in-up">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Projected Savings by Cluster</div>
                                <div className="card-subtitle">Cost savings from standardization and reuse</div>
                            </div>
                        </div>
                        <div style={{ height: 280 }}>
                            <Bar
                                data={{
                                    labels: repetitionClusters.map(c => c.name.length > 18 ? c.name.slice(0, 18) + '…' : c.name),
                                    datasets: [{
                                        label: 'Savings ($)',
                                        data: repetitionClusters.map(c => parseInt(c.savings.replace(/[^0-9]/g, ''))),
                                        backgroundColor: repetitionClusters.map(c => c.color + '99'),
                                        borderColor: repetitionClusters.map(c => c.color),
                                        borderWidth: 1,
                                        borderRadius: 6,
                                        barPercentage: 0.65,
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

                    {/* Heatmap visualization */}
                    <div className="glass-card animate-fade-in-up">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Floor × Component Repetition Matrix</div>
                                <div className="card-subtitle">Reuse rate (%) by floor and component type</div>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}></th>
                                        {repetitionHeatmap.types.map(t => (
                                            <th key={t} style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {repetitionHeatmap.floors.map((floor, fi) => (
                                        <tr key={floor}>
                                            <td style={{ padding: '6px 10px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.78rem' }}>{floor}</td>
                                            {repetitionHeatmap.data[fi].map((val, ci) => {
                                                const hue = val >= 95 ? 160 : val >= 90 ? 170 : val >= 85 ? 40 : 0;
                                                const sat = val >= 90 ? '70%' : '50%';
                                                const alpha = (val - 80) / 20 * 0.6 + 0.15;
                                                return (
                                                    <td key={ci} style={{
                                                        padding: '6px 10px', textAlign: 'center',
                                                        background: `hsla(${hue}, ${sat}, 50%, ${alpha})`,
                                                        color: 'var(--text-primary)', fontWeight: 600,
                                                        borderRadius: 4, fontSize: '0.78rem',
                                                    }}>
                                                        {val}%
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Template Library */}
                <div className="glass-card animate-fade-in-up" style={{ marginTop: 0 }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Standard Kit Templates</div>
                            <div className="card-subtitle">Auto-generated reusable templates from detected patterns</div>
                        </div>
                        <button className="btn btn-secondary btn-sm"><TrendingUp size={14} /> View All</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                        {repetitionClusters.slice(0, 4).map((c) => (
                            <div key={c.id} style={{
                                padding: '14px 16px', borderRadius: 10,
                                background: '#F8FAFC',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                cursor: 'pointer', transition: 'all 0.2s ease',
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.components} components · {c.occurrences} uses</div>
                                </div>
                                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
