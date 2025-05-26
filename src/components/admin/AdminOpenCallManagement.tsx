
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import { useOpenCalls } from '@/hooks/useOpenCalls';

const AdminOpenCallManagement = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { getAllOpenCalls, updateOpenCallStatus } = useOpenCalls();
  const { data: openCalls, isLoading } = getAllOpenCalls;

  const filteredCalls = openCalls?.filter(call => {
    const matchesSearch = 
      call.title.toLowerCase().includes(search.toLowerCase()) ||
      call.organization_name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || call.status === filter;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'live': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Open Call Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search open calls..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCalls.map((call) => (
          <Card key={call.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{call.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    by {call.profiles?.first_name || 'Unknown'} {call.profiles?.last_name || ''} 
                    ({call.profiles?.username || 'No username'})
                  </p>
                  {call.organization_name && (
                    <p className="text-sm text-gray-500">{call.organization_name}</p>
                  )}
                </div>
                <Badge className={getStatusColor(call.status)}>
                  {call.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 line-clamp-2">{call.description}</p>
              
              <div className="flex gap-2 text-xs text-gray-500">
                <span>Deadline: {new Date(call.submission_deadline).toLocaleDateString()}</span>
                <span>•</span>
                <span>Fee: ${call.submission_fee}</span>
                <span>•</span>
                <span>Max: {call.max_submissions} submissions</span>
              </div>

              {call.admin_notes && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Admin Notes:</strong> {call.admin_notes}
                </div>
              )}

              <div className="flex gap-2">
                {call.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateOpenCallStatus.mutate({ 
                        id: call.id, 
                        status: 'approved' 
                      })}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateOpenCallStatus.mutate({ 
                        id: call.id, 
                        status: 'rejected',
                        notes: 'Does not meet platform guidelines'
                      })}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                
                {call.status === 'approved' && (
                  <Button
                    size="sm"
                    onClick={() => updateOpenCallStatus.mutate({ 
                      id: call.id, 
                      status: 'live' 
                    })}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Make Live
                  </Button>
                )}

                {call.status === 'live' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateOpenCallStatus.mutate({ 
                      id: call.id, 
                      status: 'closed' 
                    })}
                  >
                    Close Call
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCalls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No open calls found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminOpenCallManagement;
