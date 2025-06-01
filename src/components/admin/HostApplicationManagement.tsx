
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Calendar, Building, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useHostApplications } from '@/hooks/useHostApplications';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const HostApplicationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | string>('all');
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  
  const { getAllHostApplications, updateHostApplicationStatus } = useHostApplications();
  const { data: applications, isLoading } = getAllHostApplications;

  const filteredApplications = applications?.filter(app => {
    const matchesSearch = app.proposed_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.organization_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.application_status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusUpdate = async (applicationId: string, status: string, notes?: string) => {
    try {
      await updateHostApplicationStatus.mutateAsync({
        applicationId,
        status,
        notes
      });
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications by title or organization..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Host Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application Details</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.proposed_title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {application.proposed_description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Deadline: {new Date(application.proposed_deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{application.organization_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="text-sm">
                        <p>{application.profiles?.first_name} {application.profiles?.last_name}</p>
                        <p className="text-muted-foreground">@{application.profiles?.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(application.application_status)}>
                      {application.application_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(application.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Application: {application.proposed_title}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Application Details */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Organization</Label>
                                <p className="text-sm mt-1">{application.organization_name}</p>
                              </div>
                              <div>
                                <Label>Proposed Deadline</Label>
                                <p className="text-sm mt-1">
                                  {new Date(application.proposed_deadline).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm mt-1 p-3 bg-muted rounded">
                                {application.proposed_description}
                              </p>
                            </div>

                            {/* Review Notes */}
                            <div>
                              <Label htmlFor="notes">Review Notes</Label>
                              <Textarea
                                id="notes"
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Add notes about your decision..."
                                rows={3}
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <Button
                                variant="default"
                                onClick={() => handleStatusUpdate(application.id, 'approved', reviewNotes)}
                                disabled={updateHostApplicationStatus.isPending}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleStatusUpdate(application.id, 'rejected', reviewNotes)}
                                disabled={updateHostApplicationStatus.isPending}
                                className="flex items-center gap-2"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate(application.id, 'pending', reviewNotes)}
                                disabled={updateHostApplicationStatus.isPending}
                                className="flex items-center gap-2"
                              >
                                <Clock className="h-4 w-4" />
                                Mark Pending
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {application.application_status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application.id, 'approved')}
                            disabled={updateHostApplicationStatus.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updateHostApplicationStatus.isPending}
                          >
                            <XCircle className="h-4 w-4" />
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
    </div>
  );
};

export default HostApplicationManagement;
