
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Palette, Briefcase, BookOpen, TrendingUp, Eye, Heart, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Active Portfolios",
      value: "567",
      change: "+8%",
      icon: Palette,
      color: "text-green-500"
    },
    {
      title: "Open Calls",
      value: "23",
      change: "+15%",
      icon: Briefcase,
      color: "text-purple-500"
    },
    {
      title: "Education Content",
      value: "89",
      change: "+5%",
      icon: BookOpen,
      color: "text-orange-500"
    }
  ];

  const recentActivity = [
    { user: "Alice Johnson", action: "Created new portfolio", time: "2 hours ago" },
    { user: "Bob Smith", action: "Submitted to open call", time: "4 hours ago" },
    { user: "Carol Davis", action: "Updated profile", time: "6 hours ago" },
    { user: "David Wilson", action: "Published artwork", time: "8 hours ago" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and management</p>
            </div>
            <Badge variant="secondary">Admin Access</Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">{stat.change}</span> from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col">
                    <Briefcase className="h-6 w-6 mb-2" />
                    <span>Open Calls</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col">
                    <BookOpen className="h-6 w-6 mb-2" />
                    <span>Education</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span>Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Metrics */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Platform Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">45,234</div>
                  <div className="text-sm text-muted-foreground">Total Portfolio Views</div>
                </div>
                <div className="text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold">12,456</div>
                  <div className="text-sm text-muted-foreground">Portfolio Likes</div>
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">234</div>
                  <div className="text-sm text-muted-foreground">Monthly Submissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <div className="text-center py-8 border-t mt-8">
            <h3 className="text-lg font-semibold mb-2">Advanced Admin Features Coming Soon</h3>
            <p className="text-muted-foreground">
              Detailed analytics, content moderation tools, and system configuration options are in development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
