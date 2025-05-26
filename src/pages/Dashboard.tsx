
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Palette, 
  Plus, 
  Eye, 
  Heart, 
  Users, 
  Briefcase, 
  BookOpen,
  Settings,
  Star,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';

interface DashboardStats {
  portfolioCount: number;
  totalViews: number;
  totalLikes: number;
  followerCount: number;
  openCallsSubmitted: number;
  featuredPortfolios: number;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch portfolio stats
        const { data: portfolios } = await supabase
          .from('portfolios')
          .select('id, view_count, is_featured')
          .eq('user_id', user.id);

        // Fetch likes count
        const { data: likes } = await supabase
          .from('portfolio_likes')
          .select('id')
          .in('portfolio_id', portfolios?.map(p => p.id) || []);

        // Fetch followers count
        const { data: followers } = await supabase
          .from('follows')
          .select('id')
          .eq('following_id', user.id);

        // Fetch submissions count
        const { data: submissions } = await supabase
          .from('submissions')
          .select('id')
          .eq('artist_id', user.id);

        const dashboardStats: DashboardStats = {
          portfolioCount: portfolios?.length || 0,
          totalViews: portfolios?.reduce((sum, p) => sum + p.view_count, 0) || 0,
          totalLikes: likes?.length || 0,
          followerCount: followers?.length || 0,
          openCallsSubmitted: submissions?.length || 0,
          featuredPortfolios: portfolios?.filter(p => p.is_featured).length || 0,
        };

        setStats(dashboardStats);

        // Mock recent activity for now
        setRecentActivity([
          {
            id: 1,
            type: 'view',
            message: 'Your portfolio "Digital Dreams" received 15 new views',
            time: '2 hours ago',
            icon: Eye,
          },
          {
            id: 2,
            type: 'like',
            message: 'Someone liked your portfolio "Abstract Visions"',
            time: '5 hours ago',
            icon: Heart,
          },
          {
            id: 3,
            type: 'follow',
            message: 'You gained 3 new followers',
            time: '1 day ago',
            icon: Users,
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const statCards = [
    {
      title: 'Portfolios',
      value: stats?.portfolioCount || 0,
      icon: Palette,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'Total portfolios created',
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'Across all portfolios',
    },
    {
      title: 'Likes',
      value: stats?.totalLikes || 0,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      description: 'Portfolio likes received',
    },
    {
      title: 'Followers',
      value: stats?.followerCount || 0,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'People following you',
    },
  ];

  const quickActions = [
    {
      title: 'Create Portfolio',
      description: 'Start a new portfolio',
      icon: Plus,
      action: () => navigate('/my-portfolios'),
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      title: 'Browse Open Calls',
      description: 'Find opportunities',
      icon: Briefcase,
      action: () => navigate('/open-calls'),
      color: 'bg-gradient-to-r from-green-500 to-green-600',
    },
    {
      title: 'Learn & Grow',
      description: 'Explore education hub',
      icon: BookOpen,
      action: () => navigate('/education'),
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
    {
      title: 'Profile Settings',
      description: 'Update your profile',
      icon: Settings,
      action: () => navigate('/profile/settings'),
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.first_name || 'Artist'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your art portfolio today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={() => navigate('/my-portfolios')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Portfolio
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Jump into your most common tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-auto p-4 justify-start space-x-3 hover:shadow-md transition-all"
                        onClick={action.action}
                      >
                        <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest portfolio updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  
                  {recentActivity.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent activity</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Create a portfolio to see your activity here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Featured Achievement */}
        {stats && stats.featuredPortfolios > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-yellow-500/10 border-yellow-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">
                      🎉 Congratulations!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You have {stats.featuredPortfolios} featured portfolio{stats.featuredPortfolios > 1 ? 's' : ''}! 
                      Featured portfolios get more visibility and opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
