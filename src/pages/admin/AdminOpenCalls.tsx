
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, MoreVertical, Calendar, DollarSign, Users, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface OpenCallData {
  id: string;
  title: string;
  organization_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'live' | 'closed';
  submission_fee: number;
  submission_deadline: string;
  created_at: string;
  host_user_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    username: string;
  };
}

const AdminOpenCalls = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | OpenCallData['status']>('all');
  const queryClient = useQueryClient();

  const { data: openCalls, isLoading } = useQuery({
    queryKey: ['admin-open-calls'],
    queryFn: async () => {
      console.log('Fetching open calls for admin...');
      
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(first_name, last_name, username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching open calls:', error);
        throw error;
      }

      console.log('Admin open calls fetched:', data);
      return data as OpenCallData[];
    },
  });

  const updateOpenCallStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Updating open call status:', id, status);
      
      const { error } = await supabase
        .from('open_calls')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating open call status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-open-calls'] });
      toast({
        title: "Status Updated",
        description: "Open call status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  const filteredOpenCalls = openCalls?.filter(call => {
    const matchesSearch = call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || call.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

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
    updateOpenCallStatus.mutate({ id, status: 'live' });
  };

  const handleReject = (id: string) => {
    updateOpenCallStatus.mutate({ id, status: 'rejected' });
  };

  if (isLoading) {
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
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Open Calls Management</h1>
              <p className="text-muted-foreground">Review and manage open call submissions</p>
            </div>
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
                      <TableHead>Host</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpenCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{call.title}</p>
                            <p className="text-sm text-muted-foreground">{call.organization_name}</p>
                            <p className="text-xs text-muted-foreground">Created: {new Date(call.created_at).toLocaleDateString()}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {call.profiles?.first_name} {call.profiles?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">@{call.profiles?.username}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(call.status)}>
                            {call.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {call.submission_fee === 0 ? 'Free' : `$${call.submission_fee}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(call.submission_deadline).toLocaleDateString()}
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
                                  disabled={updateOpenCallStatus.isPending}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject(call.id)}
                                  disabled={updateOpenCallStatus.isPending}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
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
                    <p className="text-2xl font-bold">{openCalls?.length || 0}</p>
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
                      {openCalls?.filter(c => c.status === 'pending').length || 0}
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
                      {openCalls?.filter(c => c.status === 'live').length || 0}
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
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold">
                      {openCalls?.filter(c => c.status === 'approved').length || 0}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
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
