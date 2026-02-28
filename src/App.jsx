import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BIMUpload from './pages/BIMUpload';
import RepetitionAnalytics from './pages/RepetitionAnalytics';
import KitPlanning from './pages/KitPlanning';
import InventoryForecast from './pages/InventoryForecast';
import BoQGenerator from './pages/BoQGenerator';
import ScheduleView from './pages/ScheduleView';

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bim-upload" element={<BIMUpload />} />
                <Route path="/repetition" element={<RepetitionAnalytics />} />
                <Route path="/kit-planning" element={<KitPlanning />} />
                <Route path="/inventory" element={<InventoryForecast />} />
                <Route path="/boq" element={<BoQGenerator />} />
                <Route path="/schedule" element={<ScheduleView />} />
            </Routes>
        </Layout>
    );
}
