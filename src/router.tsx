import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { EvidencePage } from './pages/EvidencePage';
import { SuspectsPage } from './pages/SuspectsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AuditPage } from './pages/AuditPage';
import { UsersPage } from './pages/UsersPage';
import { useAuthStore } from './stores/authStore';
import { Suspense, lazy } from 'react';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><LoginPage /></Suspense>,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><DashboardPage /></Suspense> },
      { path: 'cases/:id', element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><CaseDetailPage /></Suspense> },
      { path: 'evidence', element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><EvidencePage /></Suspense> },
      { path: 'suspects', element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><SuspectsPage /></Suspense> },
      { path: 'incidents', element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><IncidentsPage /></Suspense> },
      { path: 'audit', element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><AuditPage /></Suspense> },
      { path: 'users', element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><UsersPage /></Suspense> },
    ],
  },
]);