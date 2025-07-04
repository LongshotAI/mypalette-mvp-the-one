
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary'

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import OpenCalls from './pages/OpenCalls';
import OpenCallDetails from './pages/OpenCallDetails';
import PortfolioView from './pages/PortfolioView';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOpenCalls from './pages/admin/AdminOpenCalls';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ConsolidatedAdminDashboard from './pages/admin/ConsolidatedAdminDashboard';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Error fallback component
function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/open-calls" element={<OpenCalls />} />
                  <Route path="/open-calls/:id" element={<OpenCallDetails />} />

                  {/* User Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/portfolio/:username" element={<PortfolioView />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/dashboard" element={
                    <AdminRoute>
                      <ConsolidatedAdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  } />
                  <Route path="/admin/open-calls" element={
                    <AdminRoute>
                      <AdminOpenCalls />
                    </AdminRoute>
                  } />
                  <Route path="/admin/analytics" element={
                    <AdminRoute>
                      <AdminAnalytics />
                    </AdminRoute>
                  } />
                </Routes>
              </div>
              <Toaster />
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
