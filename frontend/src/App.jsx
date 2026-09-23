import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ExerciseDetailPage from './pages/ExerciseDetailPage.jsx';
import DiaryPage from './pages/DiaryPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import MetricsPage from './pages/MetricsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<CatalogPage />} />
          <Route path="exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="diary" element={<DiaryPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
