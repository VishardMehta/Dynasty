import { useState } from 'react';
import { Download, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';
import { boqItems } from '../data/mockData';

export default function BoQGenerator() {
    const [view, setView] = useState('comparison');

    const totalAiCost = boqItems.reduce((s, b) => s + b.aiQty * b.rate, 0);
    const totalManualCost = boqItems.reduce((s, b) => s + b.manualQty * b.rate, 0);
    const avgVariance = (boqItems.reduce((s, b) => s + Math.abs(b.variance), 0) / boqItems.length).toFixed(1);

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>BoQ Generator</h1>
                    <div className="subtitle">AI-powered Bill of Quantities with manual comparison</div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-secondary btn-sm"><Download size={14} /> Export CSV</button>
                    <button className="btn btn-primary btn-sm"><FileSpreadsheet size={14} /> Export PDF</button>
                </div>
            </div>

            <div className="page-content">
                {/* Accuracy Metrics */}
                <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
                    <div className="kpi-card cyan animate-fade-in-up stagger-1">
                        <div className="kpi-label">AI Accuracy</div>
                        <div className="kpi-value">97.6%</div>
                        <div className="kpi-trend up"><CheckCircle size={12} /> validated against expert takeoff</div>
                    </div>
                    <div className="kpi-card emerald animate-fade-in-up stagger-2">
                        <div className="kpi-label">Time Savings</div>
                        <div className="kpi-value">82%</div>
                        <div className="kpi-trend up">4.8s vs ~25 min manual</div>
                    </div>
                    <div className="kpi-card amber animate-fade-in-up stagger-3">
                        <div className="kpi-label">Avg Variance</div>
                        <div className="kpi-value">±{avgVariance}%</div>
                        <div className="kpi-trend up">vs. manual takeoff</div>
                    </div>
                    <div className="kpi-card violet animate-fade-in-up stagger-4">
                        <div className="kpi-label">Total AI Cost</div>
                        <div className="kpi-value">${(totalAiCost / 1000).toFixed(0)}K</div>
                        <div className="kpi-trend up">${((totalManualCost - totalAiCost) / 1000).toFixed(1)}K saved</div>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="tab-bar" style={{ maxWidth: 340 }}>
                    <button className={`tab-item ${view === 'comparison' ? 'active' : ''}`}
                        onClick={() => setView('comparison')}>AI vs Manual</button>
                    <button className={`tab-item ${view === 'ai' ? 'active' : ''}`}
                        onClick={() => setView('ai')}>AI BoQ Only</button>
                    <button className={`tab-item ${view === 'manual' ? 'active' : ''}`}
                        onClick={() => setView('manual')}>Manual BoQ</button>
                </div>

                {/* BoQ Table */}
                <div className="glass-card animate-fade-in-up stagger-3">
                    <div className="card-header">
                        <div>
                            <div className="card-title">
                                {view === 'comparison' ? 'AI vs Manual Comparison' :
                                    view === 'ai' ? 'AI-Generated BoQ' : 'Manual BoQ'}
                            </div>
                            <div className="card-subtitle">{boqItems.length} line items</div>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Item Description</th>
                                    <th>Unit</th>
                                    {(view === 'comparison' || view === 'ai') && <th>AI Qty</th>}
                                    {(view === 'comparison' || view === 'manual') && <th>Manual Qty</th>}
                                    <th>Rate ($)</th>
                                    {(view === 'comparison' || view === 'ai') && <th>AI Amount ($)</th>}
                                    {(view === 'comparison' || view === 'manual') && <th>Manual Amount ($)</th>}
                                    {view === 'comparison' && <th>Variance</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {boqItems.map((item, i) => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{i + 1}</td>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.item}</td>
                                        <td>{item.unit}</td>
                                        {(view === 'comparison' || view === 'ai') && (
                                            <td style={{ fontWeight: 600 }}>{typeof item.aiQty === 'number' ? item.aiQty.toLocaleString() : item.aiQty}</td>
                                        )}
                                        {(view === 'comparison' || view === 'manual') && (
                                            <td style={{ fontWeight: 600 }}>{typeof item.manualQty === 'number' ? item.manualQty.toLocaleString() : item.manualQty}</td>
                                        )}
                                        <td>{item.rate.toFixed(2)}</td>
                                        {(view === 'comparison' || view === 'ai') && (
                                            <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                                                {(item.aiQty * item.rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </td>
                                        )}
                                        {(view === 'comparison' || view === 'manual') && (
                                            <td style={{ fontWeight: 600, color: 'var(--accent-violet)' }}>
                                                {(item.manualQty * item.rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </td>
                                        )}
                                        {view === 'comparison' && (
                                            <td>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                                    fontWeight: 600, fontSize: '0.82rem',
                                                    color: Math.abs(item.variance) <= 2 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                                                }}>
                                                    {Math.abs(item.variance) <= 2 ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                                    {item.variance > 0 ? '+' : ''}{item.variance}%
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ borderTop: '2px solid var(--border-glass)' }}>
                                    <td colSpan={3} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>TOTAL</td>
                                    {(view === 'comparison' || view === 'ai') && <td></td>}
                                    {(view === 'comparison' || view === 'manual') && <td></td>}
                                    <td></td>
                                    {(view === 'comparison' || view === 'ai') && (
                                        <td style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '1rem' }}>
                                            ${totalAiCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    )}
                                    {(view === 'comparison' || view === 'manual') && (
                                        <td style={{ fontWeight: 700, color: 'var(--accent-violet)', fontSize: '1rem' }}>
                                            ${totalManualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    )}
                                    {view === 'comparison' && <td></td>}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
