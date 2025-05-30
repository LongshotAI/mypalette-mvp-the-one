import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from '@/hooks/use-toast';
import LandingPage from './pages/LandingPage';
import OpenCalls from './pages/OpenCalls';
import SubmissionForm from './pages/SubmissionForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import HostApplication from './pages/HostApplication';
import OpenCallDetails from './pages/OpenCallDetails';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOpenCalls from './pages/admin/AdminOpenCalls';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/open-calls" element={<OpenCalls />} />
            <Route path="/open-calls/:callId" element={<OpenCallDetails />} />
            <Route path="/submit/:callId" element={<SubmissionForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/host-application" element={<HostApplication />} />
            <Route path="/auth/:type" element={<AuthPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/open-calls" element={<AdminOpenCalls />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
