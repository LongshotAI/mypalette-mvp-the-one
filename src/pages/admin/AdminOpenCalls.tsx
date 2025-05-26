
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, MoreVertical, Calendar, DollarSign, Users, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface OpenCallData {
  id: string;
  title: string;
  organization: string;
  status: 'pending' | 'approved' | 'rejected' | 'live' | 'closed';
  submissionFee: number;
  deadline: string;
  submissions: number;
  views: number;
  createdDate: string;
}

const AdminOpenCalls = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | OpenCallData['status']>('all');

  const mockOpenCalls: OpenCallData[] = [
    {
      id: '1',
      title: 'Digital Futures Exhibition',
      organization: 'Modern Art Gallery',
      status: 'live',
      submissionFee: 25,
      deadline: '2024-03-15',
      submissions: 47,
      views: 1234,
      createdDate: '2024-01-10'
    },
    {
      id: '2',
      title: 'Emerging Artists Showcase',
      organization: 'Creative Collective',
      status: 'pending',
      submissionFee: 0,
      deadline: '2024-04-20',
      submissions: 0,
      views: 156,
      createdDate: '2024-02-01'
    },
    {
      id: '3',
      title: 'AI Art Competition',
      organization: 'Tech Museum',
      status: 'approved',
      submissionFee: 15,
      deadline: '2024-05-30',
      submissions: 23,
      views: 892,
      createdDate: '2024-01-25'
    }
  ];

  const filteredOpenCalls = mockOpenCalls.filter(call => {
    const matchesSearch = call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || call.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500';
      case 'approved': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'live': return 'default';
      case 'approved': return 'secondary';
      case 'pending': return 'outline';
      case 'rejected': return 'destructive';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleApprove = (id: string) => {
    console.log('Approve open call:', id);
  };

  const handleReject = (id: string) => {
    console.log('Reject open call:', id);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Open Calls Management</h1>
              <p className="text-muted-foreground">Review and manage open call submissions</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Open Call
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search open calls by title or organization..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'approved', 'live', 'closed', 'rejected'].map((status) => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedStatus(status as any)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Open Calls Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Open Calls ({filteredOpenCalls.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title & Organization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpenCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{call.title}</p>
                            <p className="text-sm text-muted-foreground">{call.organization}</p>
                            <p className="text-xs text-muted-foreground">Created: {call.createdDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(call.status)}>
                            {call.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {call.submissionFee === 0 ? 'Free' : `$${call.submissionFee}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {call.deadline}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Users className="h-3 w-3 mr-1" />
                            {call.submissions}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Eye className="h-3 w-3 mr-1" />
                            {call.views}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {call.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleApprove(call.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject(call.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Open Calls</p>
                    <p className="text-2xl font-bold">{mockOpenCalls.length}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold">
                      {mockOpenCalls.filter(c => c.status === 'pending').length}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Live Now</p>
                    <p className="text-2xl font-bold">
                      {mockOpenCalls.filter(c => c.status === 'live').length}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">
                      {mockOpenCalls.reduce((sum, call) => sum + call.submissions, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOpenCalls;
