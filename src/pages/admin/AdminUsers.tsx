
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, MoreHorizontal, User, Mail, Calendar } from 'lucide-react';

const AdminUsers = () => {
  const mockUsers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-15",
      portfolios: 3,
      avatar: null
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-02-01",
      portfolios: 1,
      avatar: null
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      role: "admin",
      status: "active",
      joinDate: "2023-12-10",
      portfolios: 5,
      avatar: null
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@example.com",
      role: "user",
      status: "pending",
      joinDate: "2024-03-01",
      portfolios: 0,
      avatar: null
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">User Management</h1>
              <p className="text-muted-foreground">Manage platform users and permissions</p>
            </div>
            <Badge variant="secondary">Admin Access</Badge>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search users by name or email..." 
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({mockUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar || ""} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{user.name}</h3>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={
                            user.status === 'active' ? 'default' : 
                            user.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {user.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Joined {user.joinDate}</span>
                          </div>
                          <span>{user.portfolios} portfolios</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">1,234</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">1,189</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">45</div>
                  <div className="text-sm text-muted-foreground">Pending Approval</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">5</div>
                  <div className="text-sm text-muted-foreground">Admins</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-8 border-t mt-8">
            <h3 className="text-lg font-semibold mb-2">Advanced User Management Coming Soon</h3>
            <p className="text-muted-foreground">
              Bulk actions, detailed user analytics, and permission management are in development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
