import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AlertTriangle, AlertCircle, Info, ShoppingCart, TrendingUp } from 'lucide-react';
import { inventoryForecast, inventoryAlerts, orderRecommendations, stockLevels } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function InventoryForecast() {
    const severityIcon = (sev) => {
        if (sev === 'high') return <AlertTriangle size={14} />;
        if (sev === 'medium') return <AlertCircle size={14} />;
        return <Info size={14} />;
    };

    const severityClass = (sev) => {
        if (sev === 'high') return 'danger';
        if (sev === 'medium') return 'warning';
        return 'info';
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Inventory Forecasting</h1>
                    <div className="subtitle">Predictive demand analysis and stock management</div>
                </div>
                <span className="badge warning">{inventoryAlerts.filter(a => a.severity === 'high').length} Critical Alerts</span>
            </div>

            <div className="page-content">
                {/* Demand Curve */}
                <div className="glass-card animate-fade-in-up" style={{ marginBottom: 24 }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Demand Forecast vs Available Stock</div>
                            <div className="card-subtitle">12-week lookahead — shaded area indicates predicted demand</div>
                        </div>
                    </div>
                    <div style={{ height: 320 }}>
                        <Line
                            data={{
                                labels: inventoryForecast.labels,
                                datasets: [
                                    {
                                        label: 'Predicted Demand',
                                        data: inventoryForecast.predicted,
                                        borderColor: '#00d4ff',
                                        backgroundColor: 'rgba(0,212,255,0.1)',
                                        fill: true, tension: 0.4,
                                        pointRadius: 4, pointHoverRadius: 7,
                                        pointBackgroundColor: '#00d4ff',
                                    },
                                    {
                                        label: 'Actual Usage',
                                        data: inventoryForecast.actual,
                                        borderColor: '#10b981',
                                        backgroundColor: 'transparent',
                                        fill: false, tension: 0.4,
                                        pointRadius: 5, pointHoverRadius: 7,
                                        pointBackgroundColor: '#10b981',
                                        borderDash: [6, 4],
                                    },
                                    {
                                        label: 'Available Stock',
                                        data: inventoryForecast.available,
                                        borderColor: '#f59e0b',
                                        backgroundColor: 'rgba(245,158,11,0.05)',
                                        fill: true, tension: 0,
                                        pointRadius: 2, borderWidth: 2,
                                        borderDash: [3, 3],
                                    },
                                ],
                            }}
                            options={{
                                responsive: true, maintainAspectRatio: false,
                                plugins: {
                                    legend: { labels: { color: '#5A6A7E', font: { family: 'Inter', size: 11 } } },
                                    tooltip: { backgroundColor: '#0B1F3B', titleColor: '#FFFFFF', bodyColor: '#C4CAD4', borderColor: 'rgba(46,134,255,0.2)', borderWidth: 1, cornerRadius: 8, padding: 12 },
                                },
                                scales: {
                                    x: { ticks: { color: '#5A6A7E', font: { size: 10 } }, grid: { color: '#E5E8ED' } },
                                    y: { ticks: { color: '#5A6A7E', font: { size: 10 } }, grid: { color: '#E5E8ED' } },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="grid-2">
                    {/* Shortage Alerts */}
                    <div className="glass-card animate-fade-in-up stagger-2">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Shortage & Surplus Alerts</div>
                                <div className="card-subtitle">{inventoryAlerts.length} active alerts</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {inventoryAlerts.map((alert) => (
                                <div key={alert.id} style={{
                                    padding: '12px 14px', borderRadius: 10,
                                    background: alert.severity === 'high' ? 'rgba(244,63,94,0.06)' :
                                        alert.severity === 'medium' ? 'rgba(245,158,11,0.06)' :
                                            'rgba(0,212,255,0.04)',
                                    border: `1px solid ${alert.severity === 'high' ? 'rgba(244,63,94,0.15)' :
                                        alert.severity === 'medium' ? 'rgba(245,158,11,0.15)' :
                                            'rgba(0,212,255,0.1)'}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span className={`badge ${severityClass(alert.severity)}`}>
                                            {severityIcon(alert.severity)} {alert.severity}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{alert.week}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 2 }}>{alert.material}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alert.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock Level Gauges */}
                    <div className="glass-card animate-fade-in-up stagger-3">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Current Stock Levels</div>
                                <div className="card-subtitle">Real-time inventory status</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {stockLevels.map((item) => (
                                <div key={item.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</span>
                                        <span style={{
                                            fontWeight: 600,
                                            color: item.percent >= 90 ? 'var(--accent-emerald)' :
                                                item.percent >= 75 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                                        }}>
                                            {item.current}/{item.required} {item.unit} ({item.percent}%)
                                        </span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 3, background: '#E5E8ED' }}>
                                        <div style={{
                                            width: `${item.percent}%`, height: '100%', borderRadius: 3,
                                            background: item.percent >= 90 ? 'var(--accent-emerald)' :
                                                item.percent >= 75 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                                            transition: 'width 1s ease',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Recommendations */}
                <div className="glass-card animate-fade-in-up stagger-4" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Order Recommendations</div>
                            <div className="card-subtitle">AI-suggested procurement actions</div>
                        </div>
                        <button className="btn btn-primary btn-sm"><ShoppingCart size={14} /> Generate PO</button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th>Qty</th>
                                <th>Lead Time</th>
                                <th>Order By</th>
                                <th>Est. Cost</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderRecommendations.map((rec, i) => (
                                <tr key={i}>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{rec.material}</td>
                                    <td style={{ fontWeight: 600 }}>{rec.qty}</td>
                                    <td>{rec.leadTime}</td>
                                    <td>{rec.orderBy}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{rec.cost}</td>
                                    <td>
                                        <span className={`badge ${rec.priority === 'Urgent' ? 'danger' : 'info'}`}>
                                            {rec.priority}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
