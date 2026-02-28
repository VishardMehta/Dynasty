import { useState } from 'react';
import { Upload, FileCheck, Search, ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';
import { extractedComponents } from '../data/mockData';

const steps = ['Upload', 'Parse Model', 'Extract Quantities', 'Validate'];

export default function BIMUpload() {
    const [currentStep, setCurrentStep] = useState(-1);
    const [uploaded, setUploaded] = useState(false);

    const handleUpload = () => {
        setCurrentStep(0);
        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step >= steps.length) {
                clearInterval(interval);
                setUploaded(true);
            }
            setCurrentStep(step);
        }, 1200);
    };

    const stepIcons = [Upload, Search, FileCheck, ShieldCheck];

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>BIM Upload & Quantity Takeoff</h1>
                    <div className="subtitle">AI-powered extraction from IFC / BIM models</div>
                </div>
                {uploaded && <span className="badge success">Extraction Complete</span>}
            </div>

            <div className="page-content">
                {/* Upload Zone */}
                {!uploaded && currentStep < 0 && (
                    <div className="upload-zone animate-fade-in-up" onClick={handleUpload}>
                        <div className="upload-icon"><Upload size={28} /></div>
                        <h3>Drop your BIM / IFC file here</h3>
                        <p>or click to browse — supports .ifc, .rvt, .dwg formats</p>
                        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={(e) => { e.stopPropagation(); handleUpload(); }}>
                            <Upload size={16} /> Upload Model
                        </button>
                    </div>
                )}

                {/* Processing Pipeline */}
                {currentStep >= 0 && (
                    <div className="glass-card animate-fade-in-up" style={{ marginBottom: 24 }}>
                        <div className="card-header">
                            <div className="card-title">Processing Pipeline</div>
                            {uploaded && <span className="badge success">Complete</span>}
                        </div>
                        <div className="progress-steps">
                            {steps.map((label, i) => {
                                const Icon = stepIcons[i];
                                let cls = '';
                                if (i < currentStep || uploaded) cls = 'completed';
                                else if (i === currentStep && !uploaded) cls = 'active';
                                return (
                                    <div key={i} className={`progress-step ${cls}`}>
                                        <div className="step-circle"><Icon size={18} /></div>
                                        <div className="step-label">{label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Extracted Components Table */}
                {uploaded && (
                    <div className="glass-card animate-fade-in-up stagger-2">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Extracted Components</div>
                                <div className="card-subtitle">{extractedComponents.length} components detected by AI model</div>
                            </div>
                            <button className="btn btn-secondary btn-sm">Export CSV</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Type</th>
                                        <th>Component</th>
                                        <th>Dimensions</th>
                                        <th>Qty</th>
                                        <th>Area (m²)</th>
                                        <th>AI Confidence</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {extractedComponents.map((c) => (
                                        <tr key={c.id}>
                                            <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{c.id}</td>
                                            <td><span className="chip">{c.type}</span></td>
                                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.dims}</td>
                                            <td style={{ fontWeight: 600 }}>{c.qty}</td>
                                            <td>{c.area.toFixed(1)}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{
                                                        width: 60, height: 6, borderRadius: 3,
                                                        background: 'rgba(255,255,255,0.06)',
                                                        overflow: 'hidden',
                                                    }}>
                                                        <div style={{
                                                            width: `${c.confidence}%`, height: '100%',
                                                            borderRadius: 3,
                                                            background: c.confidence > 96 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                                                        }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: c.confidence > 96 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                                                        {c.confidence}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${c.status === 'Validated' ? 'success' : 'warning'}`}>
                                                    {c.status === 'Validated' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                                    {c.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Simulated file info */}
                {uploaded && (
                    <div className="grid-3" style={{ marginTop: 24 }}>
                        <div className="glass-card animate-fade-in-up stagger-3">
                            <div className="card-title" style={{ fontSize: '0.85rem', marginBottom: 8 }}>Model Info</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <div>Format: <strong style={{ color: 'var(--text-primary)' }}>IFC 4.0</strong></div>
                                <div>Size: <strong style={{ color: 'var(--text-primary)' }}>148.2 MB</strong></div>
                                <div>Elements: <strong style={{ color: 'var(--text-primary)' }}>12,847</strong></div>
                            </div>
                        </div>
                        <div className="glass-card animate-fade-in-up stagger-4">
                            <div className="card-title" style={{ fontSize: '0.85rem', marginBottom: 8 }}>Extraction Stats</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <div>Components Found: <strong style={{ color: 'var(--text-primary)' }}>10</strong></div>
                                <div>Total Quantity: <strong style={{ color: 'var(--text-primary)' }}>910</strong></div>
                                <div>Processing Time: <strong style={{ color: 'var(--text-primary)' }}>4.8s</strong></div>
                            </div>
                        </div>
                        <div className="glass-card animate-fade-in-up stagger-5">
                            <div className="card-title" style={{ fontSize: '0.85rem', marginBottom: 8 }}>AI Model</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <div>Model: <strong style={{ color: 'var(--text-primary)' }}>FormNet v3.2</strong></div>
                                <div>Accuracy: <strong style={{ color: 'var(--accent-emerald)' }}>97.6%</strong></div>
                                <div>Last Trained: <strong style={{ color: 'var(--text-primary)' }}>2026-02-15</strong></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
