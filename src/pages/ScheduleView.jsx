import { useState } from 'react';
import { Calendar, Package, Play, Pause, SkipForward } from 'lucide-react';
import { scheduleTasks } from '../data/mockData';

const TOTAL_DAYS = 18;
const DAY_WIDTH = 52;

export default function ScheduleView() {
    const [whatIf, setWhatIf] = useState({ taskId: '', delayDays: 0 });
    const [applied, setApplied] = useState(false);

    const getModifiedTasks = () => {
        if (!applied || !whatIf.taskId) return scheduleTasks;
        return scheduleTasks.map(t => {
            if (t.id === whatIf.taskId) {
                return { ...t, start: t.start + Number(whatIf.delayDays) };
            }
            return t;
        });
    };

    const tasks = getModifiedTasks();

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Schedule Integration</h1>
                    <div className="subtitle">Gantt view with formwork kit assignments and what-if analysis</div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <span className="badge info"><Calendar size={12} /> Weeks 1–{Math.ceil(TOTAL_DAYS / 5)}</span>
                </div>
            </div>

            <div className="page-content">
                {/* Gantt Chart */}
                <div className="glass-card animate-fade-in-up" style={{ marginBottom: 24, overflowX: 'auto' }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Construction Schedule — Gantt View</div>
                            <div className="card-subtitle">Tasks with linked formwork kits</div>
                        </div>
                    </div>

                    <div style={{ minWidth: TOTAL_DAYS * DAY_WIDTH + 220 }}>
                        {/* Day headers */}
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8, marginBottom: 4 }}>
                            <div style={{ width: 200, flexShrink: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Task</div>
                            <div style={{ display: 'flex', flex: 1 }}>
                                {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                                    <div key={i} style={{
                                        width: DAY_WIDTH, textAlign: 'center', fontSize: '0.7rem',
                                        color: 'var(--text-muted)', fontWeight: 500,
                                        borderLeft: i % 5 === 0 ? '1px solid var(--border-subtle)' : 'none',
                                    }}>
                                        D{i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Task rows */}
                        {tasks.map((task, idx) => (
                            <div key={task.id} className="animate-fade-in-up"
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    padding: '6px 0', borderBottom: '1px solid var(--border-subtle)',
                                    animationDelay: `${idx * 0.05}s`,
                                }}>
                                <div style={{
                                    width: 200, flexShrink: 0, fontSize: '0.82rem',
                                    color: 'var(--text-primary)', fontWeight: 500,
                                    display: 'flex', flexDirection: 'column', paddingRight: 8,
                                }}>
                                    <span>{task.name}</span>
                                    {task.kit && (
                                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                                            <Package size={10} /> {task.kit}
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flex: 1, position: 'relative', height: 32 }}>
                                    {/* Grid lines */}
                                    {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                                        <div key={i} style={{
                                            position: 'absolute', left: i * DAY_WIDTH, top: 0, bottom: 0,
                                            width: 1,
                                            background: i % 5 === 0 ? 'var(--border-subtle)' : 'transparent',
                                        }} />
                                    ))}
                                    {/* Bar */}
                                    <div
                                        className="gantt-bar"
                                        style={{
                                            position: 'absolute',
                                            left: (task.start - 1) * DAY_WIDTH + 2,
                                            width: task.duration * DAY_WIDTH - 4,
                                            background: task.progress === 100
                                                ? `${task.color}cc`
                                                : `linear-gradient(90deg, ${task.color}cc ${task.progress}%, ${task.color}33 ${task.progress}%)`,
                                            border: `1px solid ${task.color}`,
                                        }}
                                    >
                                        {task.duration >= 3 && (
                                            <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                                                {task.progress > 0 ? `${task.progress}%` : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid-2">
                    {/* Kit Timeline */}
                    <div className="glass-card animate-fade-in-up stagger-2">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Kit Delivery Timeline</div>
                                <div className="card-subtitle">When each kit is needed, delivered, and returned</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { kit: 'KIT-003', task: 'Columns', deliver: 'Day 1', use: 'Day 1–3', returnDate: 'Day 4', status: 'Returned' },
                                { kit: 'KIT-004', task: 'Beams', deliver: 'Day 2', use: 'Day 3–5', returnDate: 'Day 6', status: 'Returned' },
                                { kit: 'KIT-001', task: 'Slab A', deliver: 'Day 4', use: 'Day 5–8', returnDate: 'Day 9', status: 'In Use' },
                                { kit: 'KIT-002', task: 'Walls', deliver: 'Day 5', use: 'Day 6–8', returnDate: 'Day 9', status: 'In Use' },
                                { kit: 'KIT-005', task: 'Slab B', deliver: 'Day 7', use: 'Day 8–11', returnDate: 'Day 12', status: 'Pending' },
                            ].map((item) => (
                                <div key={item.kit} style={{
                                    display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 80px',
                                    gap: 12, alignItems: 'center', padding: '10px 12px',
                                    borderRadius: 8, background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--border-subtle)', fontSize: '0.82rem',
                                }}>
                                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{item.kit}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>Deliver: {item.deliver}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>Use: {item.use}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>Return: {item.returnDate}</span>
                                    <span className={`badge ${item.status === 'Returned' ? 'success' : item.status === 'In Use' ? 'info' : 'warning'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* What-If Panel */}
                    <div className="glass-card animate-fade-in-up stagger-3">
                        <div className="card-header">
                            <div>
                                <div className="card-title">What-If Scenario</div>
                                <div className="card-subtitle">Simulate schedule changes and see kit impact</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Select Task to Delay</label>
                                <select
                                    value={whatIf.taskId}
                                    onChange={(e) => { setWhatIf(prev => ({ ...prev, taskId: e.target.value })); setApplied(false); }}
                                    style={{
                                        width: '100%', padding: '10px 12px', borderRadius: 8,
                                        background: 'var(--bg-input)', border: '1px solid var(--border-glass)',
                                        color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                                    }}
                                >
                                    <option value="">— Choose task —</option>
                                    {scheduleTasks.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                                    Delay (days): <strong style={{ color: 'var(--accent-cyan)' }}>{whatIf.delayDays}</strong>
                                </label>
                                <input type="range" min="0" max="5" value={whatIf.delayDays}
                                    onChange={(e) => { setWhatIf(prev => ({ ...prev, delayDays: Number(e.target.value) })); setApplied(false); }}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={() => setApplied(true)}
                                disabled={!whatIf.taskId}
                            >
                                <Play size={14} /> Apply Scenario
                            </button>
                            {applied && whatIf.taskId && (
                                <div style={{
                                    padding: 14, borderRadius: 10,
                                    background: 'rgba(0,212,255,0.06)',
                                    border: '1px solid rgba(0,212,255,0.15)',
                                    fontSize: '0.82rem', color: 'var(--text-secondary)',
                                    lineHeight: 1.6,
                                }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>Impact Analysis:</strong><br />
                                    • Task <strong style={{ color: 'var(--accent-cyan)' }}>{scheduleTasks.find(t => t.id === whatIf.taskId)?.name}</strong> shifted by <strong>{whatIf.delayDays} day(s)</strong><br />
                                    • Kit delivery rescheduled accordingly<br />
                                    • {whatIf.delayDays >= 3 ? (
                                        <span style={{ color: 'var(--accent-rose)' }}>⚠ Critical path affected — overall project may be delayed by {whatIf.delayDays - 1} day(s)</span>
                                    ) : (
                                        <span style={{ color: 'var(--accent-emerald)' }}>✓ Within float — no impact on critical path</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Material Flow (Simplified Sankey-style) */}
                <div className="glass-card animate-fade-in-up stagger-4" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Material Flow Summary</div>
                            <div className="card-subtitle">Formwork component movement across construction phases</div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, textAlign: 'center' }}>
                        {['Yard Storage', 'Transport', 'On-Site Staging', 'Active Use', 'Stripping & Return'].map((stage, i) => (
                            <div key={stage}>
                                <div style={{
                                    padding: '16px 8px', borderRadius: 10,
                                    background: `rgba(0,212,255,${0.04 + i * 0.03})`,
                                    border: '1px solid var(--border-subtle)',
                                    marginBottom: 6,
                                }}>
                                    <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>
                                        {[360, 48, 72, 164, 48][i]}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>
                                        units
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    {stage}
                                </div>
                                {i < 4 && (
                                    <div style={{ color: 'var(--text-muted)', margin: '4px 0', fontSize: '0.9rem' }}>→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
