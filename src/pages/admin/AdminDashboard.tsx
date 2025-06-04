
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Palette, 
  Calendar, 
  BarChart3, 
  Shield,
  Settings,
  Database,
  Film
} from 'lucide-react';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import AIFilm3AdminPanel from '@/components/admin/AIFilm3AdminPanel';
import UserManagementTable from '@/components/admin/UserManagementTable';
import AdminOpenCallManagement from '@/components/admin/AdminOpenCallManagement';
import HostApplicationManagement from '@/components/admin/HostApplicationManagement';
import AdminDebugInfo from '@/components/admin/AdminDebugInfo';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const overviewCards = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Portfolios',
      value: '1,203',
      change: '+8%',
      icon: Palette,
      color: 'text-green-600',
    },
    {
      title: 'Open Calls',
      value: '45',
      change: '+3%',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Monthly Growth',
      value: '18.2%',
      change: '+2.4%',
      icon: BarChart3,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage MyPalette platform and users</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Database className="h-3 w-3 mr-1" />
          All Systems Operational
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="open-calls">Open Calls</TabsTrigger>
          <TabsTrigger value="aifilm3">AIFilm3</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{card.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveTab('users')} className="w-full">
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Open Calls
                </CardTitle>
                <CardDescription>Review and manage open call applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveTab('open-calls')} className="w-full">
                  Review Applications
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  AIFilm3 Festival
                </CardTitle>
                <CardDescription>Manage AIFilm3 festival announcements and content</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveTab('aifilm3')} className="w-full">
                  Manage Festival
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <AdminAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTable />
        </TabsContent>

        <TabsContent value="open-calls">
          <div className="space-y-6">
            <AdminOpenCallManagement />
            <HostApplicationManagement />
          </div>
        </TabsContent>

        <TabsContent value="aifilm3">
          <AIFilm3AdminPanel />
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>Platform status and debugging information</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminDebugInfo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
