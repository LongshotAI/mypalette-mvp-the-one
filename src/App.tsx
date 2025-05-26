
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";

// Public pages
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Discover from "@/pages/Discover";
import ArtistProfile from "@/pages/ArtistProfile";
import PortfolioView from "@/pages/PortfolioView";
import OpenCalls from "@/pages/OpenCalls";
import OpenCallDetails from "@/pages/OpenCallDetails";
import Education from "@/pages/Education";
import EducationCategory from "@/pages/EducationCategory";
import EducationContent from "@/pages/EducationContent";

// Protected pages
import Dashboard from "@/pages/Dashboard";
import MyPortfolios from "@/pages/MyPortfolios";
import PortfolioEditor from "@/pages/PortfolioEditor";
import SubmissionForm from "@/pages/SubmissionForm";
import ProfileSettings from "@/pages/ProfileSettings";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminOpenCalls from "@/pages/admin/AdminOpenCalls";
import AdminEducation from "@/pages/admin/AdminEducation";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/artists/:username" element={<ArtistProfile />} />
                <Route path="/portfolio/:slug" element={<PortfolioView />} />
                <Route path="/open-calls" element={<OpenCalls />} />
                <Route path="/open-calls/:id" element={<OpenCallDetails />} />
                <Route path="/education" element={<Education />} />
                <Route path="/education/:category" element={<EducationCategory />} />
                <Route path="/education/content/:slug" element={<EducationContent />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/my-portfolios" element={
                  <ProtectedRoute>
                    <MyPortfolios />
                  </ProtectedRoute>
                } />
                <Route path="/portfolio/:id/edit" element={
                  <ProtectedRoute>
                    <PortfolioEditor />
                  </ProtectedRoute>
                } />
                <Route path="/submit/:callId" element={
                  <ProtectedRoute>
                    <SubmissionForm />
                  </ProtectedRoute>
                } />
                <Route path="/profile/settings" element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } />

                {/* Admin routes */}
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

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
