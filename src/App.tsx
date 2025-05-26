
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import PortfolioCreate from '@/pages/PortfolioCreate';
import PortfolioEditor from '@/pages/PortfolioEditor';
import PortfolioView from '@/pages/PortfolioView';
import OpenCalls from '@/pages/OpenCalls';
import OpenCallDetail from '@/pages/OpenCallDetail';
import SubmissionForm from '@/pages/SubmissionForm';
import HostApplication from '@/pages/HostApplication';
import Discover from '@/pages/Discover';
import Education from '@/pages/Education';
import AdminDashboard from '@/pages/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-portfolio" element={<PortfolioCreate />} />
              <Route path="/portfolio/:id/edit" element={<PortfolioEditor />} />
              <Route path="/portfolio/:slug" element={<PortfolioView />} />
              <Route path="/open-calls" element={<OpenCalls />} />
              <Route path="/open-calls/:callId" element={<OpenCallDetail />} />
              <Route path="/open-calls/:callId/submit" element={<SubmissionForm />} />
              <Route path="/host-application" element={<HostApplication />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/education" element={<Education />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
