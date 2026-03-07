import { useState, useRef } from 'react';
import { Upload, FileCheck, Search, ShieldCheck, CheckCircle, AlertTriangle, Download, FileDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../engine/processingEngine';

const steps = ['Upload', 'Parse Model', 'Extract Quantities', 'Validate'];

export default function BIMUpload() {
    const { components, isDataLoaded, processUpload, uploadInfo, addActivity } = useApp();
    const [currentStep, setCurrentStep] = useState(isDataLoaded ? steps.length : -1);
    const [uploaded, setUploaded] = useState(isDataLoaded);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;
        setError(null);
        setCurrentStep(0);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            let step = 0;
            const interval = setInterval(() => {
                step++;
                setCurrentStep(step);
                if (step >= steps.length) {
                    clearInterval(interval);
                    const res = processUpload(text, file.name, file.size);
                    if (res.success) {
                        setUploaded(true);
                        setResult(res);
                    } else {
                        setError(res.error);
                        setCurrentStep(-1);
                    }
                }
            }, 800);
        };
        reader.onerror = () => { setError('Failed to read file'); setCurrentStep(-1); };
        reader.readAsText(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDownloadSample = () => {
        const link = document.createElement('a');
        link.href = '/sampleData.csv';
        link.download = 'dynasty_sample_data.csv';
        link.click();
        addActivity('cyan', '<strong>Sample CSV</strong> downloaded for testing');
    };

    const handleExportComponents = () => {
        const data = components.map(c => ({
            ID: c.id, Type: c.type, Name: c.name, Dimensions: c.dims,
            Qty: c.qty, 'Area (m²)': c.area, Confidence: c.confidence + '%', Status: c.status,
        }));
        exportToCSV(data, 'dynasty_extracted_components.csv');
        addActivity('emerald', `<strong>Exported ${data.length} components</strong> to CSV`);
    };

    const stepIcons = [Upload, Search, FileCheck, ShieldCheck];
    const displayComponents = components;

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>BIM Upload & Quantity Takeoff</h1>
                    <div className="subtitle">AI-powered extraction from IFC / BIM / CSV models</div>
                </div>
                {uploaded && <span className="badge success">Extraction Complete</span>}
            </div>

            <div className="page-content">
                {/* Upload Zone */}
                {!uploaded && currentStep < 0 && (
                    <div className="upload-zone animate-fade-in-up"
                        onDrop={handleDrop} onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}>
                        <div className="upload-icon"><Upload size={28} /></div>
                        <h3>Drop your BIM / CSV file here</h3>
                        <p>Supports .csv, .ifc, .rvt formats — or download a sample to test</p>
                        {error && <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}>{error}</p>}
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                                <Upload size={16} /> Upload File
                            </button>
                            <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); handleDownloadSample(); }}>
                                <FileDown size={16} /> Download Sample CSV
                            </button>
                        </div>
                        <input ref={fileInputRef} type="file" accept=".csv,.ifc,.rvt" style={{ display: 'none' }}
                            onChange={(e) => handleFile(e.target.files[0])} />
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
                                <div className="card-subtitle">{displayComponents.length} components detected by AI model</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-secondary btn-sm" onClick={handleExportComponents}>
                                    <Download size={14} /> Export CSV
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={() => { setUploaded(false); setCurrentStep(-1); }}>
                                    <Upload size={14} /> Upload New
                                </button>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Type</th><th>Component</th><th>Dimensions</th>
                                        <th>Qty</th><th>Area (m²)</th><th>AI Confidence</th><th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayComponents.map((c) => (
                                        <tr key={c.id}>
                                            <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{c.id}</td>
                                            <td><span className="chip">{c.type}</span></td>
                                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.dims}</td>
                                            <td style={{ fontWeight: 600 }}>{c.qty}</td>
                                            <td>{c.area.toFixed(1)}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ width: 60, height: 6, borderRadius: 3, background: '#E5E8ED', overflow: 'hidden' }}>
                                                        <div style={{
                                                            width: `${c.confidence}%`, height: '100%', borderRadius: 3,
                                                            background: c.confidence > 96 ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                                                        }} />
                                                    </div>
                                                    <span style={{
                                                        fontSize: '0.8rem', fontWeight: 600,
                                                        color: c.confidence > 96 ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                                                    }}>
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

                {/* File & Extraction Stats */}
                {uploaded && (
                    <div className="grid-3" style={{ marginTop: 24 }}>
                        <div className="glass-card animate-fade-in-up stagger-3">
                            <div className="card-title" style={{ fontSize: '0.85rem', marginBottom: 8 }}>File Info</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <div>File: <strong style={{ color: 'var(--text-primary)' }}>{uploadInfo?.fileName || 'sample_data.csv'}</strong></div>
                                <div>Size: <strong style={{ color: 'var(--text-primary)' }}>{uploadInfo?.fileSize || '2.1 KB'}</strong></div>
                                <div>Format: <strong style={{ color: 'var(--text-primary)' }}>CSV</strong></div>
                            </div>
                        </div>
                        <div className="glass-card animate-fade-in-up stagger-4">
                            <div className="card-title" style={{ fontSize: '0.85rem', marginBottom: 8 }}>Extraction Stats</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <div>Components: <strong style={{ color: 'var(--text-primary)' }}>{uploadInfo?.componentCount || displayComponents.length}</strong></div>
                                <div>Total Quantity: <strong style={{ color: 'var(--text-primary)' }}>{(uploadInfo?.totalQty || displayComponents.reduce((s, c) => s + c.qty, 0)).toLocaleString()}</strong></div>
                                <div>Processing: <strong style={{ color: 'var(--text-primary)' }}>{uploadInfo?.processTime || '0.3s'}</strong></div>
                            </div>
                        </div>
                        <div className="glass-card animate-fade-in-up stagger-5">
                            <div className="card-title" style={{ fontSize: '0.85rem', marginBottom: 8 }}>AI Model</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <div>Model: <strong style={{ color: 'var(--text-primary)' }}>FormNet v3.2</strong></div>
                                <div>Avg Confidence: <strong style={{ color: 'var(--accent-emerald)' }}>{uploadInfo?.avgConfidence || '97.6%'}</strong></div>
                                <div>Last Trained: <strong style={{ color: 'var(--text-primary)' }}>2026-02-15</strong></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
