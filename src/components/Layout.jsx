import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Upload, Repeat, Package, BarChart3,
    FileText, CalendarRange, ChevronLeft, ChevronRight, Crown
} from 'lucide-react';

const navItems = [
    { section: 'Overview' },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { section: 'Data & Analysis' },
    { path: '/bim-upload', label: 'BIM Upload & Takeoff', icon: Upload },
    { path: '/repetition', label: 'Repetition Analytics', icon: Repeat },
    { path: '/boq', label: 'BoQ Generator', icon: FileText },
    { section: 'Planning' },
    { path: '/kit-planning', label: 'Kit Planning', icon: Package },
    { path: '/inventory', label: 'Inventory Forecast', icon: BarChart3 },
    { path: '/schedule', label: 'Schedule View', icon: CalendarRange },
];

export default function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-icon"><Crown size={18} /></div>
                    <span className="logo-text">Dynasty</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item, i) => {
                        if (item.section) {
                            return <div key={i} className="nav-section-title">{item.section}</div>;
                        }
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-toggle">
                    <button onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand' : 'Collapse'}>
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className={`main-area ${collapsed ? 'collapsed' : ''}`}>
                {children}
            </main>
        </div>
    );
}
