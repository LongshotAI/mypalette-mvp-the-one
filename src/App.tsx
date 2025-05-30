
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';

// Pages
import Index from '@/pages/Index';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import PortfolioView from '@/pages/PortfolioView';
import PortfolioEditor from '@/pages/PortfolioEditor';
import MyPortfolios from '@/pages/MyPortfolios';
import ArtistProfile from '@/pages/ArtistProfile';
import ProfileSettings from '@/pages/ProfileSettings';
import Discover from '@/pages/Discover';
import OpenCalls from '@/pages/OpenCalls';
import OpenCallDetails from '@/pages/OpenCallDetails';
import SubmissionForm from '@/pages/SubmissionForm';
import HostApplication from '@/pages/HostApplication';
import Education from '@/pages/Education';
import EducationCategory from '@/pages/EducationCategory';
import EducationContent from '@/pages/EducationContent';
import NotFound from '@/pages/NotFound';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminOpenCalls from '@/pages/admin/AdminOpenCalls';
import AdminEducation from '@/pages/admin/AdminEducation';

// AIFilm3 Pages
import AIFilm3Info from '@/pages/aifilm3/AIFilm3Info';
import AIFilm3Announcements from '@/pages/aifilm3/AIFilm3Announcements';

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                
                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                
                {/* Public Portfolio & Profile Routes */}
                <Route path="/portfolio/:slug" element={<PortfolioView />} />
                <Route path="/artist/:username" element={<ArtistProfile />} />
                <Route path="/discover" element={<Discover />} />
                
                {/* Open Calls - Public */}
                <Route path="/open-calls" element={<OpenCalls />} />
                <Route path="/open-calls/:callId" element={<OpenCallDetails />} />
                
                {/* Education - Public */}
                <Route path="/education" element={<Education />} />
                <Route path="/education/:category" element={<EducationCategory />} />
                <Route path="/education/:category/:slug" element={<EducationContent />} />
                
                {/* AIFilm3 Routes */}
                <Route path="/aifilm3/info" element={<AIFilm3Info />} />
                <Route path="/aifilm3/announcements" element={<AIFilm3Announcements />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/portfolios" element={
                  <ProtectedRoute>
                    <MyPortfolios />
                  </ProtectedRoute>
                } />
                <Route path="/portfolio/:slug/edit" element={
                  <ProtectedRoute>
                    <PortfolioEditor />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } />
                <Route path="/submit/:callId" element={
                  <ProtectedRoute>
                    <SubmissionForm />
                  </ProtectedRoute>
                } />
                <Route path="/host-application" element={
                  <ProtectedRoute>
                    <HostApplication />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
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
                <Route path="/admin/education" element={
                  <AdminRoute>
                    <AdminEducation />
                  </AdminRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
