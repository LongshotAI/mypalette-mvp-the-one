
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Discover from './pages/Discover';
import OpenCalls from './pages/OpenCalls';
import SubmissionForm from './pages/SubmissionForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import HostApplication from './pages/HostApplication';
import OpenCallDetails from './pages/OpenCallDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOpenCalls from './pages/admin/AdminOpenCalls';
import AIFilm3Info from './pages/aifilm3/AIFilm3Info';
import AIFilm3Announcements from './pages/aifilm3/AIFilm3Announcements';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/open-calls" element={<OpenCalls />} />
              <Route path="/open-calls/:callId" element={<OpenCallDetails />} />
              <Route path="/aifilm3/info" element={<AIFilm3Info />} />
              <Route path="/aifilm3/announcements" element={<AIFilm3Announcements />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route 
                path="/submit/:callId" 
                element={
                  <ProtectedRoute>
                    <SubmissionForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:username" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-profile" 
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host-application" 
                element={
                  <ProtectedRoute>
                    <HostApplication />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/open-calls" 
                element={
                  <AdminRoute>
                    <AdminOpenCalls />
                  </AdminRoute>
                } 
              />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
