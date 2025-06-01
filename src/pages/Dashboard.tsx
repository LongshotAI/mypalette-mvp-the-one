
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Palette, 
  Eye, 
  Heart, 
  Upload, 
  Settings,
  Plus,
  Edit,
  Calendar,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { usePortfolios } from '@/hooks/usePortfolios';
import { useSubmissions } from '@/hooks/useSubmissions';
import CreatePortfolioModal from '@/components/portfolio/CreatePortfolioModal';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { portfolios, loading: portfoliosLoading } = usePortfolios();
  const { getUserSubmissions } = useSubmissions();
  const { data: submissions, isLoading: submissionsLoading } = getUserSubmissions;

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handlePortfolioCreated = () => {
    // Portfolios will be refetched automatically
  };

  if (profileLoading || portfoliosLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.first_name || user?.email}
              </h1>
              <p className="text-muted-foreground">
                Manage your artistic presence and showcase your work
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEditProfile}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <CreatePortfolioModal onSuccess={handlePortfolioCreated} />
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolios</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolios?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {portfolios?.filter(p => p.is_public).length || 0} public
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {portfolios?.reduce((total, p) => total + (p.view_count || 0), 0) || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all portfolios
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {submissions?.filter(s => s.is_selected).length || 0} selected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge variant={profile?.bio ? 'default' : 'secondary'}>
                    {profile?.bio ? 'Complete' : 'Incomplete'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Profile completion
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="portfolios" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Portfolios Tab */}
              <TabsContent value="portfolios" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Portfolios</h2>
                  <CreatePortfolioModal 
                    onSuccess={handlePortfolioCreated}
                    trigger={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Portfolio
                      </Button>
                    }
                  />
                </div>

                {portfolios && portfolios.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => (
                      <PortfolioCard
                        key={portfolio.id}
                        portfolio={portfolio}
                        showActions={true}
                        onEdit={(p) => navigate(`/portfolio/${p.id}/edit`)}
                        onDelete={(id) => {
                          // Handle delete
                          console.log('Delete portfolio:', id);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first portfolio to showcase your artistic work
                      </p>
                      <CreatePortfolioModal onSuccess={handlePortfolioCreated} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Submissions Tab */}
              <TabsContent value="submissions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Submissions</h2>
                  <Button onClick={() => navigate('/open-calls')}>
                    <Award className="h-4 w-4 mr-2" />
                    Browse Open Calls
                  </Button>
                </div>

                {submissionsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : submissions && submissions.length > 0 ? (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <Card key={submission.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="font-semibold">
                                {submission.open_calls?.title || 'Unknown Open Call'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {submission.open_calls?.organization_name}
                              </p>
                              <div className="flex gap-2">
                                <Badge variant={submission.payment_status === 'paid' ? 'default' : 'secondary'}>
                                  {submission.payment_status}
                                </Badge>
                                {submission.is_selected && (
                                  <Badge variant="default">Selected</Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(submission.submitted_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Submit your work to open calls and exhibitions
                      </p>
                      <Button onClick={() => navigate('/open-calls')}>
                        <Award className="h-4 w-4 mr-2" />
                        Browse Open Calls
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <Button onClick={handleEditProfile}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {profile?.first_name} {profile?.last_name}
                        </h3>
                        <p className="text-muted-foreground">@{profile?.username}</p>
                      </div>
                      
                      {profile?.bio && (
                        <div>
                          <h4 className="font-medium">Bio</h4>
                          <p className="text-sm text-muted-foreground">{profile.bio}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile?.artistic_medium && (
                          <div>
                            <h4 className="font-medium">Medium</h4>
                            <p className="text-sm text-muted-foreground">{profile.artistic_medium}</p>
                          </div>
                        )}
                        {profile?.location && (
                          <div>
                            <h4 className="font-medium">Location</h4>
                            <p className="text-sm text-muted-foreground">{profile.location}</p>
                          </div>
                        )}
                      </div>

                      {!profile?.bio && (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground mb-4">
                            Complete your profile to enhance your presence
                          </p>
                          <Button onClick={handleEditProfile}>
                            Complete Profile
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-xl font-semibold">Analytics & Insights</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {portfolios?.slice(0, 3).map((portfolio) => (
                          <div key={portfolio.id} className="flex justify-between items-center">
                            <span className="text-sm">{portfolio.title}</span>
                            <Badge variant="outline">
                              {portfolio.view_count || 0} views
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Profile created: {new Date(profile?.created_at || '').toLocaleDateString()}</p>
                        <p>Last updated: {new Date(profile?.updated_at || '').toLocaleDateString()}</p>
                        <p>Total portfolios: {portfolios?.length || 0}</p>
                        <p>Total submissions: {submissions?.length || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
