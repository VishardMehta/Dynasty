import { useState } from 'react';
import { Bell, Search, Settings, ChevronDown, Building2 } from 'lucide-react';
import { projectInfo } from '../data/mockData';

export default function HeaderBar() {
    const [showNotif, setShowNotif] = useState(false);

    return (
        <div className="header-bar">
            <div className="header-left">
                <div className="header-project-selector">
                    <Building2 size={16} className="header-project-icon" />
                    <div className="header-project-info">
                        <span className="header-project-name">{projectInfo.name}</span>
                        <span className="header-project-meta">{projectInfo.location} • {projectInfo.contractor}</span>
                    </div>
                    <ChevronDown size={14} className="header-chevron" />
                </div>
            </div>

            <div className="header-right">
                <div className="header-search">
                    <Search size={15} />
                    <input type="text" placeholder="Search kits, components, tasks..." />
                </div>

                <div className="header-actions">
                    <button className="header-icon-btn" onClick={() => setShowNotif(!showNotif)} title="Notifications">
                        <Bell size={18} />
                        <span className="notif-dot" />
                    </button>
                    <button className="header-icon-btn" title="Settings">
                        <Settings size={18} />
                    </button>
                    <div className="header-avatar">
                        <span>VM</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
