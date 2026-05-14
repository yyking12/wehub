import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Guardian from './components/Guardian';
import PageTransition from './components/PageTransition';
import { useGitHubApps } from './hooks/useGitHubApps';
import { GitHubAppsProvider } from './context/GitHubAppsContext';
import { ThemeProvider } from './context/ThemeContext';

const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const DetailPage = lazy(() => import('./pages/DetailPage'));
const HotPage = lazy(() => import('./pages/HotPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

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

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const { allApps, loading, error } = useGitHubApps();

  return (
    <BrowserRouter>
      <ThemeProvider>
        <GitHubAppsProvider allApps={allApps} loading={loading} error={error}>
          <div className="min-h-screen">
            <ScrollProgress />
            <Navbar />
            <Suspense fallback={<LoadingFallback />}>
              <AppRoutes />
            </Suspense>
            <Guardian />
          </div>
        </GitHubAppsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
