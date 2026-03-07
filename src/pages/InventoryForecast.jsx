import { useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AlertTriangle, AlertCircle, Info, ShoppingCart, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../engine/processingEngine';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function InventoryForecast() {
    const { forecast, alerts, stocks, orders, isDataLoaded, addActivity } = useApp();
    const [selectedSeverity, setSelectedSeverity] = useState('all');

    const filteredAlerts = selectedSeverity === 'all'
        ? alerts
        : alerts.filter(a => a.severity === selectedSeverity);

    const criticalCount = alerts.filter(a => a.severity === 'high').length;

    const handleGeneratePO = () => {
        if (orders.length === 0) {
            addActivity('amber', '<strong>No orders</strong> to generate — all stock levels adequate');
            return;
        }
        const data = orders.map(o => ({
            Material: o.material,
            Quantity: o.qty,
            'Lead Time': o.leadTime,
            'Order By': o.orderBy,
            Priority: o.priority,
            'Est. Cost': o.cost,
        }));
        exportToCSV(data, 'dynasty_purchase_order.csv');
        addActivity('emerald', `<strong>Purchase Order</strong> generated — ${data.length} items exported to CSV`);
    };

    const severityIcon = (s) => {
        if (s === 'high') return <AlertTriangle size={14} />;
        if (s === 'medium') return <AlertCircle size={14} />;
        return <Info size={14} />;
    };

    const severityClass = (s) => {
        if (s === 'high') return 'danger';
        if (s === 'medium') return 'warning';
        return 'info';
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Inventory Forecasting</h1>
                    <div className="subtitle">Predictive demand analysis and stock management</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {isDataLoaded && <span className="badge success">Live Data</span>}
                    {criticalCount > 0 && <span className="badge danger">{criticalCount} CRITICAL ALERTS</span>}
                </div>
            </div>

            <div className="page-content">
                {/* Forecast Chart */}
                <div className="glass-card animate-fade-in-up">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Demand Forecast vs Available Stock</div>
                            <div className="card-subtitle">12-week lookahead — shaded area indicates predicted demand</div>
                        </div>
                    </div>
                    <div style={{ height: 340 }}>
                        <Line
                            data={{
                                labels: forecast.labels,
                                datasets: [
                                    { label: 'Predicted Demand', data: forecast.predicted, borderColor: '#2E86FF', backgroundColor: 'rgba(46,134,255,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointHoverRadius: 6 },
                                    { label: 'Actual Usage', data: forecast.actual, borderColor: '#00B894', fill: false, tension: 0.4, pointRadius: 4, pointHoverRadius: 6, borderDash: [5, 5] },
                                    { label: 'Available Stock', data: forecast.available, borderColor: '#F39C12', fill: false, tension: 0, pointRadius: 2, borderWidth: 1.5, borderDash: [2, 4] },
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

                <div className="grid-2-1" style={{ marginTop: 24 }}>
                    {/* Alerts */}
                    <div className="glass-card animate-fade-in-up stagger-2">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Shortage & Surplus Alerts</div>
                                <div className="card-subtitle">{alerts.length} active alerts</div>
                            </div>
                            <div className="tab-bar" style={{ maxWidth: 280 }}>
                                {['all', 'high', 'medium', 'low'].map(s => (
                                    <button key={s} className={`tab-item ${selectedSeverity === s ? 'active' : ''}`}
                                        onClick={() => setSelectedSeverity(s)}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {filteredAlerts.length === 0 && (
                                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No alerts for this filter</div>
                            )}
                            {filteredAlerts.map((alert) => (
                                <div key={alert.id} style={{
                                    padding: '14px 16px', borderRadius: 10,
                                    background: alert.severity === 'high' ? 'rgba(231,76,60,0.04)' : '#F8FAFC',
                                    border: `1px solid ${alert.severity === 'high' ? '#E74C3C33' : 'var(--border-subtle)'}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <span className={`badge ${severityClass(alert.severity)}`}>
                                            {severityIcon(alert.severity)} {alert.severity.toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{alert.week}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{alert.material}</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>{alert.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock Levels */}
                    <div className="glass-card animate-fade-in-up stagger-3">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Current Stock Levels</div>
                                <div className="card-subtitle">Real-time inventory status</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {stocks.map((item, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</span>
                                        <span style={{
                                            fontWeight: 600,
                                            color: item.percent >= 90 ? 'var(--accent-emerald)' : item.percent >= 70 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                                        }}>
                                            {item.current}/{item.required} {item.unit} ({item.percent}%)
                                        </span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 3, background: '#E5E8ED' }}>
                                        <div style={{
                                            width: `${item.percent}%`, height: '100%', borderRadius: 3,
                                            background: item.percent >= 90 ? 'var(--accent-emerald)' : item.percent >= 70 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                                            transition: 'width 0.5s ease',
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
                        <button className="btn btn-primary btn-sm" onClick={handleGeneratePO}>
                            <ShoppingCart size={14} /> Generate PO
                        </button>
                    </div>
                    {orders.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                            All stock levels adequate — no orders needed
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>MATERIAL</th><th>QTY</th><th>LEAD TIME</th>
                                        <th>ORDER BY</th><th>EST. COST</th><th>PRIORITY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => (
                                        <tr key={i}>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{order.material}</td>
                                            <td style={{ fontWeight: 600 }}>{order.qty}</td>
                                            <td>{order.leadTime}</td>
                                            <td>{order.orderBy}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{order.cost}</td>
                                            <td>
                                                <span className={`badge ${order.priority === 'Urgent' ? 'danger' : 'info'}`}>
                                                    {order.priority.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
