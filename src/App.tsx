import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DiscoverPage from './pages/DiscoverPage';
import DetailPage from './pages/DetailPage';
import HotPage from './pages/HotPage';
import CategoryPage from './pages/CategoryPage';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Guardian from './components/Guardian';
import PageTransition from './components/PageTransition';
import { useGitHubApps } from './hooks/useGitHubApps';
import { GitHubAppsProvider } from './context/GitHubAppsContext';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="popLayout">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/discover" element={<PageTransition><DiscoverPage /></PageTransition>} />
        <Route path="/hot" element={<PageTransition><HotPage /></PageTransition>} />
        <Route path="/category/:name" element={<PageTransition><CategoryPage /></PageTransition>} />
        <Route path="/app/:id" element={<PageTransition><DetailPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { allApps, loading, error } = useGitHubApps();

  return (
    <BrowserRouter>
      <GitHubAppsProvider allApps={allApps} loading={loading} error={error}>
        <div className="min-h-screen text-white">
          <ScrollProgress />
          <Navbar />
          <AppRoutes />
          <Guardian />
        </div>
      </GitHubAppsProvider>
    </BrowserRouter>
  );
}
