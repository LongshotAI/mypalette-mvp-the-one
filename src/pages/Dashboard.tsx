
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolios } from '@/hooks/usePortfolios';
import { useSubmissions } from '@/hooks/useSubmissions';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Palette, 
  FileText, 
  Calendar, 
  Settings,
  Eye,
  Edit,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { portfolios, loading: portfoliosLoading } = usePortfolios();
  const { getUserSubmissions } = useSubmissions();
  const { data: submissions, isLoading: submissionsLoading } = getUserSubmissions;

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to access your dashboard.
              </p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    return profile?.username || 'Artist';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {getUserName()}!
            </h1>
            <p className="text-muted-foreground">
              Welcome to your creative dashboard. Manage your portfolios, submissions, and artistic journey.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Portfolios</p>
                    <p className="text-2xl font-bold">{portfolios?.length || 0}</p>
                  </div>
                  <Palette className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                    <p className="text-2xl font-bold">{submissions?.length || 0}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Eye className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Awards</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Dashboard Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        className="w-full justify-start" 
                        onClick={() => navigate('/create-portfolio')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Portfolio
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/open-calls')}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Browse Open Calls
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/profile')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {submissions && submissions.length > 0 ? (
                          submissions.slice(0, 3).map((submission) => (
                            <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <p className="font-medium text-sm">
                                  {submission.submission_data?.title || 'Submission'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {submission.payment_status}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No recent activity</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Portfolios Tab */}
              <TabsContent value="portfolios" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My Portfolios</h2>
                  <Button onClick={() => navigate('/create-portfolio')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Portfolio
                  </Button>
                </div>

                {portfoliosLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : portfolios && portfolios.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => (
                      <Card key={portfolio.id} className="overflow-hidden">
                        {portfolio.cover_image && (
                          <div className="aspect-video bg-muted">
                            <img
                              src={portfolio.cover_image}
                              alt={portfolio.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{portfolio.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {portfolio.description}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/portfolio/${portfolio.slug}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => navigate(`/portfolio/${portfolio.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first portfolio to showcase your artwork
                      </p>
                      <Button onClick={() => navigate('/create-portfolio')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Portfolio
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Submissions Tab */}
              <TabsContent value="submissions" className="space-y-6">
                <h2 className="text-2xl font-bold">My Submissions</h2>

                {submissionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : submissions && submissions.length > 0 ? (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <Card key={submission.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold mb-1">
                                {submission.submission_data?.title || 'Untitled Submission'}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Submitted to: {submission.open_calls?.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge variant={submission.payment_status === 'paid' ? 'default' : 'secondary'}>
                                {submission.payment_status}
                              </Badge>
                              {submission.is_selected && (
                                <Badge variant="default">Selected</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by browsing open calls and submitting your work
                      </p>
                      <Button onClick={() => navigate('/open-calls')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Browse Open Calls
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <h2 className="text-2xl font-bold">Dashboard Settings</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Role</p>
                      <Badge variant="outline">{profile?.role}</Badge>
                    </div>
                    <Button onClick={() => navigate('/profile')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
