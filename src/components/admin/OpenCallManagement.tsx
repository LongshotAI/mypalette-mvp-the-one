
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface OpenCall {
  id: string;
  title: string;
  description: string;
  submission_deadline: string;
  status: 'pending' | 'live' | 'closed';
  organization_name: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    username?: string;
  };
}

const OpenCallManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: openCalls, isLoading, error } = useQuery({
    queryKey: ['admin-open-calls'],
    queryFn: async () => {
      console.log('Fetching open calls for admin management...');
      
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

      console.log('Open calls fetched:', data);
      return data as OpenCall[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ callId, newStatus }: { callId: string; newStatus: string }) => {
      console.log('Updating open call status:', callId, newStatus);
      
      const { error } = await supabase
        .from('open_calls')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', callId);

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
        title: "Error",
        description: error.message || "Failed to update open call status.",
        variant: "destructive",
      });
    },
  });

  const filteredOpenCalls = openCalls?.filter(call =>
    call.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'live':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'closed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading open calls. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search open calls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Open Calls Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpenCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No open calls found
                </TableCell>
              </TableRow>
            ) : (
              filteredOpenCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{call.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {call.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{call.organization_name}</p>
                      {call.profiles && (
                        <p className="text-sm text-muted-foreground">
                          by {call.profiles.first_name} {call.profiles.last_name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(call.status)}>
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(call.submission_deadline).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(call.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(`/open-calls/${call.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {call.status === 'pending' && (
                          <DropdownMenuItem
                            onClick={() => updateStatus.mutate({
                              callId: call.id,
                              newStatus: 'live'
                            })}
                            disabled={updateStatus.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {call.status === 'live' && (
                          <DropdownMenuItem
                            onClick={() => updateStatus.mutate({
                              callId: call.id,
                              newStatus: 'closed'
                            })}
                            disabled={updateStatus.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Close
                          </DropdownMenuItem>
                        )}
                        {call.status !== 'pending' && (
                          <DropdownMenuItem
                            onClick={() => updateStatus.mutate({
                              callId: call.id,
                              newStatus: 'pending'
                            })}
                            disabled={updateStatus.isPending}
                          >
                            Mark as Pending
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total: {openCalls?.length || 0}</span>
        <span>Live: {openCalls?.filter(c => c.status === 'live').length || 0}</span>
        <span>Pending: {openCalls?.filter(c => c.status === 'pending').length || 0}</span>
        <span>Closed: {openCalls?.filter(c => c.status === 'closed').length || 0}</span>
      </div>
    </div>
  );
};

export default OpenCallManagement;
