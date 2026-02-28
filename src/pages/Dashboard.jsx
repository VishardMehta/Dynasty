import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, ArcElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    TrendingDown, DollarSign, Zap, Target, Recycle, Package,
    ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import {
    kpiData, inventoryForecast, costBreakdown,
    materialDistribution, activityFeed, projectInfo
} from '../data/mockData';

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

export default function Dashboard() {
    const trendIcon = (dir) => {
        if (dir === 'up') return <ArrowUpRight size={14} />;
        if (dir === 'down') return <ArrowDownRight size={14} />;
        return <Minus size={14} />;
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <div className="subtitle">{projectInfo.name} — Floor {projectInfo.currentFloor} of {projectInfo.totalFloors}</div>
                </div>
                <span className="badge info">{projectInfo.completionPercent}% Complete</span>
            </div>

            <div className="page-content">
                {/* KPI Cards */}
                <div className="kpi-grid">
                    {kpiData.map((kpi, i) => {
                        const Icon = kpiIcons[i];
                        return (
                            <div key={i} className={`kpi-card ${kpi.color} animate-fade-in-up stagger-${i + 1}`}>
                                <div className="kpi-icon"><Icon size={20} /></div>
                                <div className="kpi-label">{kpi.label}</div>
                                <div className="kpi-value">{kpi.value}</div>
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
                                        backgroundColor: materialDistribution.colors,
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
