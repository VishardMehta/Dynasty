import { useState, useEffect } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, ArcElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    TrendingDown, DollarSign, Zap, Target, Recycle, Package,
    ArrowUpRight, ArrowDownRight, Minus, MapPin, Calendar, Users, Building2
} from 'lucide-react';
import {
    kpiData, inventoryForecast, costBreakdown,
    materialDistribution, activityFeed, projectInfo
} from '../data/mockData';
import { useCountUp } from '../hooks/useAnimations';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Filler, Tooltip, Legend
);

const kpiIcons = [TrendingDown, DollarSign, Zap, Target, Recycle, Package];

const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { labels: { color: '#5A6A7E', font: { family: 'Inter', size: 11 } } },
        tooltip: {
            backgroundColor: '#0B1F3B',
            titleColor: '#FFFFFF',
            bodyColor: '#C4CAD4',
            borderColor: 'rgba(46,134,255,0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
        },
    },
    scales: {
        x: { ticks: { color: '#5A6A7E', font: { size: 10 } }, grid: { color: '#E5E8ED' } },
        y: { ticks: { color: '#5A6A7E', font: { size: 10 } }, grid: { color: '#E5E8ED' } },
    },
};

function AnimatedKPI({ value }) {
    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));
    const prefix = value.startsWith('$') ? '$' : '';
    const suffix = value.includes('%') ? '%' : value.includes('×') ? '×' : value.includes('K') ? 'K' : '';
    const animated = useCountUp(numericPart, 1200);

    if (isNaN(numericPart)) return <div className="kpi-value">{value}</div>;

    let display = animated;
    if (suffix === 'K') display = Math.round(animated);
    else if (suffix === '%' || suffix === '×') display = animated.toFixed(animated % 1 === 0 ? 0 : animated < 10 ? 2 : 1);
    else display = Math.round(animated);

    return <div className="kpi-value">{prefix}{display}{suffix}</div>;
}

export default function Dashboard() {
    const [progressWidth, setProgressWidth] = useState(0);
    const trendIcon = (dir) => {
        if (dir === 'up') return <ArrowUpRight size={14} />;
        if (dir === 'down') return <ArrowDownRight size={14} />;
        return <Minus size={14} />;
    };

    useEffect(() => {
        const timer = setTimeout(() => setProgressWidth(projectInfo.completionPercent), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <div className="subtitle">Project overview and key performance indicators</div>
                </div>
                <span className="badge info">{projectInfo.completionPercent}% Complete</span>
            </div>

            <div className="page-content">
                {/* Project Overview Banner */}
                <div className="project-overview animate-fade-in-up">
                    <div className="project-overview-info">
                        <div className="project-overview-title">{projectInfo.name}</div>
                        <div className="project-overview-meta">
                            <span><MapPin size={13} /> {projectInfo.location}</span>
                            <span><Building2 size={13} /> {projectInfo.contractor}</span>
                            <span><Calendar size={13} /> {projectInfo.startDate} → {projectInfo.estimatedEnd}</span>
                            <span><Users size={13} /> Floor {projectInfo.currentFloor} of {projectInfo.totalFloors}</span>
                        </div>
                    </div>
                    <div className="project-overview-progress">
                        <div className="progress-bar-value">{projectInfo.completionPercent}%</div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${progressWidth}%` }} />
                        </div>
                        <div className="progress-bar-label">Overall Completion</div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="kpi-grid">
                    {kpiData.map((kpi, i) => {
                        const Icon = kpiIcons[i];
                        return (
                            <div key={i} className={`kpi-card ${kpi.color} animate-fade-in-up stagger-${i + 1}`}>
                                <div className="kpi-icon"><Icon size={20} /></div>
                                <div className="kpi-label">{kpi.label}</div>
                                <AnimatedKPI value={kpi.value} />
                                <div className={`kpi-trend ${kpi.direction}`}>
                                    {trendIcon(kpi.direction)} {kpi.trend}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid-2-1">
                    {/* Inventory Forecast Chart */}
                    <div className="glass-card animate-fade-in-up stagger-2">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Inventory Forecast vs Actual</div>
                                <div className="card-subtitle">12-week rolling prediction</div>
                            </div>
                        </div>
                        <div style={{ height: 300 }}>
                            <Line
                                data={{
                                    labels: inventoryForecast.labels,
                                    datasets: [
                                        {
                                            label: 'Predicted Demand',
                                            data: inventoryForecast.predicted,
                                            borderColor: '#2E86FF',
                                            backgroundColor: 'rgba(46,134,255,0.08)',
                                            fill: true,
                                            tension: 0.4,
                                            pointRadius: 3,
                                            pointHoverRadius: 6,
                                        },
                                        {
                                            label: 'Actual Usage',
                                            data: inventoryForecast.actual,
                                            borderColor: '#00B894',
                                            backgroundColor: 'rgba(0,184,148,0.08)',
                                            fill: false,
                                            tension: 0.4,
                                            pointRadius: 4,
                                            pointHoverRadius: 6,
                                            borderDash: [5, 5],
                                        },
                                        {
                                            label: 'Available Stock',
                                            data: inventoryForecast.available,
                                            borderColor: '#F39C12',
                                            fill: false,
                                            tension: 0,
                                            pointRadius: 2,
                                            borderWidth: 1.5,
                                            borderDash: [2, 4],
                                        },
                                    ],
                                }}
                                options={chartDefaults}
                            />
                        </div>
                    </div>

                    {/* Material Distribution */}
                    <div className="glass-card animate-fade-in-up stagger-3">
                        <div className="card-header">
                            <div className="card-title">Material Distribution</div>
                        </div>
                        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Doughnut
                                data={{
                                    labels: materialDistribution.labels,
                                    datasets: [{
                                        data: materialDistribution.values,
                                        backgroundColor: ['#2E86FF', '#1F3C88', '#00B894', '#F39C12', '#E74C3C', '#8896A6'],
                                        borderWidth: 0,
                                        hoverOffset: 6,
                                    }],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: '65%',
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { color: '#5A6A7E', font: { size: 10, family: 'Inter' }, padding: 12, usePointStyle: true, pointStyleWidth: 8 },
                                        },
                                        tooltip: chartDefaults.plugins.tooltip,
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Cost Breakdown + Activity */}
                <div className="grid-2-1">
                    <div className="glass-card animate-fade-in-up stagger-4">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Cost Breakdown by Phase</div>
                                <div className="card-subtitle">Planned vs Actual expenditure</div>
                            </div>
                        </div>
                        <div style={{ height: 280 }}>
                            <Bar
                                data={{
                                    labels: costBreakdown.labels,
                                    datasets: [
                                        {
                                            label: 'Planned',
                                            data: costBreakdown.planned,
                                            backgroundColor: 'rgba(46,134,255,0.7)',
                                            borderRadius: 4,
                                            barPercentage: 0.6,
                                        },
                                        {
                                            label: 'Actual',
                                            data: costBreakdown.actual,
                                            backgroundColor: 'rgba(31,60,136,0.7)',
                                            borderRadius: 4,
                                            barPercentage: 0.6,
                                        },
                                    ],
                                }}
                                options={{
                                    ...chartDefaults,
                                    plugins: {
                                        ...chartDefaults.plugins,
                                        legend: { ...chartDefaults.plugins.legend, position: 'top' },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="glass-card animate-fade-in-up stagger-5">
                        <div className="card-header">
                            <div className="card-title">Recent Activity</div>
                        </div>
                        <ul className="activity-list">
                            {activityFeed.slice(0, 6).map((item) => (
                                <li key={item.id} className="activity-item">
                                    <span className={`activity-dot ${item.type}`} />
                                    <div>
                                        <div className="activity-text" dangerouslySetInnerHTML={{ __html: item.text }} />
                                        <div className="activity-time">{item.time}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
