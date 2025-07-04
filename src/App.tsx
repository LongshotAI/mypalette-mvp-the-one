import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary'

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import OpenCalls from './pages/OpenCalls';
import AuthLogin from './pages/auth/AuthLogin';
import AuthRegister from './pages/auth/AuthRegister';
import AuthForgotPassword from './pages/auth/AuthForgotPassword';
import AuthResetPassword from './pages/auth/AuthResetPassword';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOpenCalls from './pages/admin/AdminOpenCalls';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ConsolidatedAdminDashboard from './pages/admin/ConsolidatedAdminDashboard';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="mypalette-ui-theme">
          <QueryClient>
            <BrowserRouter>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/open-calls" element={<OpenCalls />} />

                  {/* Auth Routes */}
                  <Route path="/auth/login" element={<AuthLogin />} />
                  <Route path="/auth/register" element={<AuthRegister />} />
                  <Route path="/auth/forgot-password" element={<AuthForgotPassword />} />
                  <Route path="/auth/reset-password" element={<AuthResetPassword />} />

                  {/* User Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/portfolio/:username" element={<Portfolio />} />
                  
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
          </QueryClient>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
