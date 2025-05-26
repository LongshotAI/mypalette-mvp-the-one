
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  Image, 
  FileText, 
  Plus, 
  Eye,
  Calendar,
  Award,
  Users,
  TrendingUp,
  Building2,
  Send
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { usePortfolios } from '@/hooks/usePortfolios';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useHostApplications } from '@/hooks/useHostApplications';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { portfolios, loading: portfoliosLoading } = usePortfolios();
  const { getUserSubmissions } = useSubmissions();
  const { getUserHostApplications } = useHostApplications();

  const { data: submissions, isLoading: submissionsLoading } = getUserSubmissions;
  const { data: hostApplications, isLoading: hostApplicationsLoading } = getUserHostApplications;

  // Fetch user's open calls if they're an admin
  const { data: userOpenCalls, isLoading: openCallsLoading } = useQuery({
    queryKey: ['user-open-calls'],
    queryFn: async () => {
      if (!user?.id || profile?.role !== 'admin') return [];
      
      const { data, error } = await supabase
        .from('open_calls')
        .select('*')
        .eq('host_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && profile?.role === 'admin'
  });

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
              <p className="text-muted-foreground mb-4">
                You need to be signed in to access your dashboard.
              </p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isLoading = portfoliosLoading || submissionsLoading || openCallsLoading || hostApplicationsLoading;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.first_name || user.email}!
            </h1>
            <p className="text-muted-foreground">
              Manage your portfolios, submissions, and artistic journey
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="hosting">Hosting</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Portfolios</p>
                          <p className="text-2xl font-bold">{portfolios?.length || 0}</p>
                        </div>
                        <Briefcase className="h-8 w-8 text-primary" />
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
                          <p className="text-sm font-medium text-muted-foreground">Selected</p>
                          <p className="text-2xl font-bold">
                            {submissions?.filter(s => s.is_selected).length || 0}
                          </p>
                        </div>
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Host Apps</p>
                          <p className="text-2xl font-bold">{hostApplications?.length || 0}</p>
                        </div>
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button 
                          onClick={() => navigate('/create-portfolio')}
                          className="h-20 flex-col gap-2"
                        >
                          <Plus className="h-6 w-6" />
                          Create Portfolio
                        </Button>
                        <Button 
                          onClick={() => navigate('/open-calls')}
                          variant="outline"
                          className="h-20 flex-col gap-2"
                        >
                          <Eye className="h-6 w-6" />
                          Browse Open Calls
                        </Button>
                        <Button 
                          onClick={() => navigate('/host-application')}
                          variant="outline"
                          className="h-20 flex-col gap-2"
                        >
                          <Send className="h-6 w-6" />
                          Apply to Host
                        </Button>
                        <Button 
                          onClick={() => navigate('/profile')}
                          variant="outline"
                          className="h-20 flex-col gap-2"
                        >
                          <User className="h-6 w-6" />
                          Edit Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Portfolios Tab */}
              <TabsContent value="portfolios" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Portfolios</h2>
                  <Button onClick={() => navigate('/create-portfolio')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Portfolio
                  </Button>
                </div>

                {portfolios && portfolios.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => (
                      <motion.div
                        key={portfolio.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                {portfolio.cover_image ? (
                                  <img 
                                    src={portfolio.cover_image} 
                                    alt={portfolio.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Image className="h-12 w-12 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{portfolio.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {portfolio.description || 'No description'}
                                </p>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge variant={portfolio.is_public ? 'default' : 'secondary'}>
                                  {portfolio.is_public ? 'Public' : 'Private'}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  onClick={() => navigate(`/portfolio/${portfolio.id}/edit`)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first portfolio to showcase your artwork
                      </p>
                      <Button onClick={() => navigate('/create-portfolio')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Portfolio
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Submissions Tab */}
              <TabsContent value="submissions" className="space-y-6">
                <h2 className="text-2xl font-bold">Your Submissions</h2>

                {submissions && submissions.length > 0 ? (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <Card key={submission.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {submission.open_calls?.title || 'Open Call'}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                              </p>
                              <div className="flex gap-2">
                                <Badge variant={submission.payment_status === 'paid' ? 'default' : 'secondary'}>
                                  {submission.payment_status}
                                </Badge>
                                {submission.is_selected && (
                                  <Badge className="bg-green-500">Selected</Badge>
                                )}
                              </div>
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
                        Browse open calls and submit your artwork
                      </p>
                      <Button onClick={() => navigate('/open-calls')}>
                        Browse Open Calls
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Hosting Tab */}
              <TabsContent value="hosting" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Host Applications & Open Calls</h2>
                  <Button onClick={() => navigate('/host-application')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Apply to Host
                  </Button>
                </div>

                {/* Host Applications */}
                {hostApplications && hostApplications.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Host Applications</h3>
                    {hostApplications.map((application) => (
                      <Card key={application.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{application.proposed_title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {application.organization_name} • Applied: {new Date(application.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={
                              application.application_status === 'approved' ? 'default' : 
                              application.application_status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }>
                              {application.application_status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* User's Open Calls (if admin) */}
                {userOpenCalls && userOpenCalls.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Open Calls</h3>
                    {userOpenCalls.map((openCall) => (
                      <Card key={openCall.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{openCall.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Deadline: {new Date(openCall.submission_deadline).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={openCall.status === 'live' ? 'default' : 'secondary'}>
                              {openCall.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {(!hostApplications || hostApplications.length === 0) && (!userOpenCalls || userOpenCalls.length === 0) && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No hosting activity yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Apply to host an open call and start curating artwork
                      </p>
                      <Button onClick={() => navigate('/host-application')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Apply to Host
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
