
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

// Imports
import Home from '@/pages/Home';
import Discover from '@/pages/Discover';
import OpenCalls from '@/pages/OpenCalls';
import SubmitToOpenCall from '@/pages/SubmitToOpenCall';
import HostApplication from '@/pages/HostApplication';
import Education from '@/pages/Education';
import AuthLayout from '@/pages/auth/AuthLayout';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Profile from '@/pages/Profile';
import Portfolio from '@/pages/Portfolio';
import MyPortfolios from '@/pages/MyPortfolios';
import CreatePortfolio from '@/pages/CreatePortfolio';
import EditPortfolio from '@/pages/EditPortfolio';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminOpenCalls from '@/pages/admin/AdminOpenCalls';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminContent from '@/pages/admin/AdminContent';
import UserSubmissions from '@/pages/UserSubmissions';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/open-calls" element={<OpenCalls />} />
            <Route path="/submit/:callId" element={<SubmitToOpenCall />} />
            <Route path="/host-application" element={<HostApplication />} />
            <Route path="/education" element={<Education />} />
            <Route path="/submissions" element={<UserSubmissions />} />
            
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            
            <Route path="/profile" element={<Profile />} />
            <Route path="/portfolio/:slug" element={<Portfolio />} />
            <Route path="/my-portfolios" element={<MyPortfolios />} />
            <Route path="/create-portfolio" element={<CreatePortfolio />} />
            <Route path="/edit-portfolio/:id" element={<EditPortfolio />} />
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/open-calls" element={<AdminOpenCalls />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/content" element={<AdminContent />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
