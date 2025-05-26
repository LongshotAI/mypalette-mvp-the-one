
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, DollarSign, Users, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';

const AdminOpenCalls = () => {
  const mockOpenCalls = [
    {
      id: 1,
      title: "Digital Art Exhibition 2024",
      organization: "Modern Art Gallery",
      status: "live",
      deadline: "2024-03-15",
      fee: 25,
      submissions: 45,
      maxSubmissions: 100
    },
    {
      id: 2,
      title: "NFT Collection Showcase",
      organization: "Crypto Art Space",
      status: "pending",
      deadline: "2024-04-01",
      fee: 50,
      submissions: 0,
      maxSubmissions: 50
    },
    {
      id: 3,
      title: "Emerging Artists Competition",
      organization: "Art Foundation",
      status: "approved",
      deadline: "2024-05-15",
      fee: 0,
      submissions: 23,
      maxSubmissions: 200
    },
    {
      id: 4,
      title: "Photography Contest 2024",
      organization: "Photo Gallery",
      status: "closed",
      deadline: "2024-02-28",
      fee: 15,
      submissions: 150,
      maxSubmissions: 150
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'default';
      case 'approved': return 'secondary';
      case 'pending': return 'secondary';
      case 'closed': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Open Calls Management</h1>
              <p className="text-muted-foreground">Manage and moderate open call submissions</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Admin Access</Badge>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Open Call
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search open calls..." 
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

          {/* Open Calls List */}
          <Card>
            <CardHeader>
              <CardTitle>Open Calls ({mockOpenCalls.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOpenCalls.map((call) => (
                  <div key={call.id} className="border rounded-lg p-6 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{call.title}</h3>
                          <Badge variant={getStatusColor(call.status)}>
                            {call.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{call.organization}</p>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Deadline: {call.deadline}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Fee: ${call.fee}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{call.submissions}/{call.maxSubmissions} submissions</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {Math.round((call.submissions / call.maxSubmissions) * 100)}% full
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        View Submissions
                      </Button>
                      {call.status === 'pending' && (
                        <>
                          <Button variant="default" size="sm">
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">23</div>
                  <div className="text-sm text-muted-foreground">Total Open Calls</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">8</div>
                  <div className="text-sm text-muted-foreground">Live Calls</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">5</div>
                  <div className="text-sm text-muted-foreground">Pending Approval</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">1,234</div>
                  <div className="text-sm text-muted-foreground">Total Submissions</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-8 border-t mt-8">
            <h3 className="text-lg font-semibold mb-2">Advanced Open Call Management Coming Soon</h3>
            <p className="text-muted-foreground">
              Automated approval workflows, submission analytics, and curator tools are in development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOpenCalls;
