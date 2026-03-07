import { useState } from 'react';
import { Calendar, Package, Play, Pause, SkipForward, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TOTAL_DAYS = 18;
const DAY_WIDTH = 52;

export default function ScheduleView() {
    const { schedule, kits, isDataLoaded, addActivity } = useApp();
    const [whatIf, setWhatIf] = useState(0);
    const [simulating, setSimulating] = useState(false);
    const [currentDay, setCurrentDay] = useState(0);

    const tasks = schedule.map(t => ({
        ...t,
        start: Math.max(1, (t.start || 1) + whatIf),
        duration: t.duration || 3,
    }));

    const handleSimulate = () => {
        if (simulating) {
            setSimulating(false);
            return;
        }
        setSimulating(true);
        setCurrentDay(0);
        let day = 0;
        const interval = setInterval(() => {
            day += 0.5;
            setCurrentDay(Math.round(day * 2) / 2);
            if (day >= TOTAL_DAYS) {
                clearInterval(interval);
                setSimulating(false);
                addActivity('cyan', `<strong>Schedule simulation</strong> completed — ${tasks.length} tasks evaluated`);
            }
        }, 200);
    };

    const handleSkip = () => {
        setCurrentDay(TOTAL_DAYS);
        setSimulating(false);
        addActivity('cyan', '<strong>Schedule simulation</strong> skipped to end');
    };

    // Kit status info
    const kitStatusMap = {};
    kits.forEach(k => { kitStatusMap[k.id] = k.status; });

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Schedule View</h1>
                    <div className="subtitle">Gantt chart with kit assignments and what-if analysis</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {isDataLoaded && <span className="badge success">Live Data</span>}
                    <span className="badge info">{tasks.length} tasks</span>
                </div>
            </div>

            <div className="page-content">
                {/* Controls */}
                <div className="glass-card animate-fade-in-up" style={{ marginBottom: 24 }}>
                    <div className="card-header">
                        <div className="card-title">Schedule Controls</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary btn-sm" onClick={handleSimulate}>
                                {simulating ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Simulate</>}
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={handleSkip}>
                                <SkipForward size={14} /> Skip
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div className="range-control">
                            <label>
                                <span>What-If Delay (days)</span>
                                <span style={{ color: whatIf > 0 ? 'var(--accent-rose)' : whatIf < 0 ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                                    {whatIf > 0 ? `+${whatIf}d delay` : whatIf < 0 ? `${whatIf}d earlier` : 'No change'}
                                </span>
                            </label>
                            <input type="range" min="-3" max="5" value={whatIf}
                                onChange={(e) => setWhatIf(Number(e.target.value))} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--text-muted)' }}>
                                Simulation Day: <strong style={{ color: 'var(--accent-cyan)' }}>{currentDay}</strong> / {TOTAL_DAYS}
                            </div>
                            {whatIf > 0 && (
                                <span className="badge warning" style={{ fontSize: '0.75rem' }}>
                                    ⚠️ {whatIf}-day delay impacts {tasks.filter(t => t.start + t.duration > TOTAL_DAYS).length} tasks
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gantt Chart */}
                <div className="glass-card animate-fade-in-up stagger-2">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Gantt Chart</div>
                            <div className="card-subtitle">Task timeline with kit assignments</div>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: TOTAL_DAYS * DAY_WIDTH + 200 }}>
                            {/* Day Headers */}
                            <div style={{ display: 'flex', marginLeft: 200, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8, marginBottom: 8 }}>
                                {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                                    <div key={i} style={{
                                        width: DAY_WIDTH, textAlign: 'center', fontSize: '0.75rem', fontWeight: 500,
                                        color: i + 1 <= currentDay ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                    }}>
                                        D{i + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Current Day Indicator */}
                            {currentDay > 0 && (
                                <div style={{
                                    position: 'relative', height: 0, zIndex: 10,
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: 200 + (currentDay - 1) * DAY_WIDTH + DAY_WIDTH / 2,
                                        top: 0, width: 2, height: tasks.length * 48,
                                        background: 'var(--accent-cyan)', opacity: 0.4,
                                    }} />
                                </div>
                            )}

                            {/* Task Bars */}
                            {tasks.map((task, idx) => {
                                const left = 200 + (task.start - 1) * DAY_WIDTH;
                                const width = task.duration * DAY_WIDTH;
                                const progress = task.progress || 0;
                                const isOverflow = task.start + task.duration > TOTAL_DAYS + 1;
                                const kitStatus = kitStatusMap[task.kit];

                                return (
                                    <div key={task.id} style={{
                                        display: 'flex', alignItems: 'center', height: 44,
                                        borderBottom: '1px solid #F0F2F5',
                                    }}>
                                        {/* Task Label */}
                                        <div style={{ width: 200, paddingRight: 12, fontSize: '0.82rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {task.name}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Package size={10} /> {task.kit}
                                                {kitStatus && (
                                                    <span style={{ marginLeft: 4 }}>
                                                        {kitStatus === 'Deployed' ? <CheckCircle size={10} color="var(--accent-emerald)" /> :
                                                            kitStatus === 'Ready' ? <Clock size={10} color="var(--accent-cyan)" /> :
                                                                <AlertCircle size={10} color="var(--accent-amber)" />}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Gantt Bar */}
                                        <div style={{ position: 'relative', flex: 1, height: 24 }}>
                                            <div style={{
                                                position: 'absolute', left, width: Math.min(width, (TOTAL_DAYS - task.start + 1) * DAY_WIDTH),
                                                height: 24, borderRadius: 6,
                                                background: isOverflow
                                                    ? `repeating-linear-gradient(45deg, ${task.color}99, ${task.color}99 4px, ${task.color}55 4px, ${task.color}55 8px)`
                                                    : task.color + '44',
                                                border: `1.5px solid ${task.color}`,
                                                overflow: 'hidden',
                                            }}>
                                                {/* Progress fill */}
                                                <div style={{
                                                    width: `${progress}%`, height: '100%',
                                                    background: task.color + 'AA',
                                                    transition: 'width 0.3s ease',
                                                }} />
                                                {/* Label */}
                                                <div style={{
                                                    position: 'absolute', top: 0, left: 6, right: 6,
                                                    lineHeight: '24px', fontSize: '0.7rem', fontWeight: 600,
                                                    color: progress > 40 ? '#fff' : 'var(--text-primary)',
                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                }}>
                                                    {progress > 0 ? `${progress}%` : task.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Kit Summary Cards */}
                <div className="glass-card animate-fade-in-up stagger-3" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div className="card-title">Kit → Task Mapping</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
                        {tasks.map((task) => {
                            const kit = kits.find(k => k.id === task.kit);
                            return (
                                <div key={task.id} style={{
                                    padding: '12px 16px', borderRadius: 10,
                                    background: '#F8FAFC', border: '1px solid var(--border-subtle)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 600, color: task.color, fontSize: '0.85rem' }}>{task.kit}</span>
                                        {kit && (
                                            <span className={`badge ${kit.status === 'Deployed' ? 'success' : kit.status === 'Ready' ? 'info' : 'warning'}`} style={{ fontSize: '0.7rem' }}>
                                                {kit.status}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: 4 }}>{task.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                        Day {task.start}–{task.start + task.duration - 1} • {kit?.totalWeight || '—'} • {kit?.utilization || 0}% util
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
