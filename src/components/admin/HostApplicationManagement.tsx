
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building,
  Calendar,
  DollarSign,
  Users,
  Award
} from 'lucide-react';
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
    const matchesSearch = 
      app.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.proposed_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || app.application_status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'under_review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'outline';
      case 'under_review': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    try {
      await updateHostApplicationStatus.mutateAsync({
        applicationId,
        status,
        notes: reviewNotes
      });
      setReviewNotes('');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to update application status:', error);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Host Applications</h2>
          <p className="text-muted-foreground">Review and manage open call hosting applications</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications by organization, title, or applicant..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'under_review', 'approved', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications found matching your criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization & Title</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Prize Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.organization_name}</p>
                        <p className="text-sm text-muted-foreground">{application.proposed_title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deadline: {new Date(application.proposed_deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {application.profiles?.first_name} {application.profiles?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">@{application.profiles?.username}</p>
                        <p className="text-xs text-muted-foreground">{application.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(application.application_status)}>
                        {application.application_status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {application.proposed_prize_amount ? 
                          `$${application.proposed_prize_amount.toLocaleString()}` : 
                          'Not specified'
                        }
                      </div>
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
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Review Host Application</DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-6">
                                {/* Organization Info */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Building className="h-5 w-5" />
                                      Organization Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Organization Name</Label>
                                        <p className="text-sm">{selectedApplication.organization_name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Type</Label>
                                        <p className="text-sm">{selectedApplication.organization_type}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Contact Email</Label>
                                        <p className="text-sm">{selectedApplication.contact_email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <p className="text-sm">{selectedApplication.phone || 'Not provided'}</p>
                                      </div>
                                    </div>
                                    {selectedApplication.website_url && (
                                      <div>
                                        <Label className="text-sm font-medium">Website</Label>
                                        <p className="text-sm">{selectedApplication.website_url}</p>
                                      </div>
                                    )}
                                    {selectedApplication.address && (
                                      <div>
                                        <Label className="text-sm font-medium">Address</Label>
                                        <p className="text-sm">{selectedApplication.address}</p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Proposed Open Call */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Award className="h-5 w-5" />
                                      Proposed Open Call
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium">Title</Label>
                                      <p className="text-sm">{selectedApplication.proposed_title}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Description</Label>
                                      <p className="text-sm">{selectedApplication.proposed_description}</p>
                                    </div>
                                    {selectedApplication.proposed_theme && (
                                      <div>
                                        <Label className="text-sm font-medium">Theme</Label>
                                        <p className="text-sm">{selectedApplication.proposed_theme}</p>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Deadline</Label>
                                        <p className="text-sm">{new Date(selectedApplication.proposed_deadline).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Target Submissions</Label>
                                        <p className="text-sm">{selectedApplication.target_submissions || 100}</p>
                                      </div>
                                    </div>
                                    {selectedApplication.proposed_exhibition_dates && (
                                      <div>
                                        <Label className="text-sm font-medium">Exhibition Dates</Label>
                                        <p className="text-sm">{selectedApplication.proposed_exhibition_dates}</p>
                                      </div>
                                    )}
                                    {selectedApplication.proposed_venue && (
                                      <div>
                                        <Label className="text-sm font-medium">Venue</Label>
                                        <p className="text-sm">{selectedApplication.proposed_venue}</p>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                      {selectedApplication.proposed_budget && (
                                        <div>
                                          <Label className="text-sm font-medium">Budget</Label>
                                          <p className="text-sm">${selectedApplication.proposed_budget.toLocaleString()}</p>
                                        </div>
                                      )}
                                      {selectedApplication.proposed_prize_amount && (
                                        <div>
                                          <Label className="text-sm font-medium">Prize Amount</Label>
                                          <p className="text-sm">${selectedApplication.proposed_prize_amount.toLocaleString()}</p>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Experience & Qualifications */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Users className="h-5 w-5" />
                                      Experience & Qualifications
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium">Experience Description</Label>
                                      <p className="text-sm">{selectedApplication.experience_description}</p>
                                    </div>
                                    {selectedApplication.previous_exhibitions && (
                                      <div>
                                        <Label className="text-sm font-medium">Previous Exhibitions</Label>
                                        <p className="text-sm">{selectedApplication.previous_exhibitions}</p>
                                      </div>
                                    )}
                                    <div>
                                      <Label className="text-sm font-medium">Curatorial Statement</Label>
                                      <p className="text-sm">{selectedApplication.curatorial_statement}</p>
                                    </div>
                                    {selectedApplication.technical_requirements && (
                                      <div>
                                        <Label className="text-sm font-medium">Technical Requirements</Label>
                                        <p className="text-sm">{selectedApplication.technical_requirements}</p>
                                      </div>
                                    )}
                                    {selectedApplication.marketing_plan && (
                                      <div>
                                        <Label className="text-sm font-medium">Marketing Plan</Label>
                                        <p className="text-sm">{selectedApplication.marketing_plan}</p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Admin Review */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Admin Review</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <Label htmlFor="reviewNotes">Review Notes</Label>
                                      <Textarea
                                        id="reviewNotes"
                                        value={reviewNotes}
                                        onChange={(e) => setReviewNotes(e.target.value)}
                                        placeholder="Add notes about this application..."
                                        rows={3}
                                      />
                                    </div>
                                    
                                    {selectedApplication.application_status === 'pending' && (
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                                          disabled={updateHostApplicationStatus.isPending}
                                          className="flex-1"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                                          disabled={updateHostApplicationStatus.isPending}
                                          className="flex-1"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </Button>
                                      </div>
                                    )}

                                    {selectedApplication.admin_notes && (
                                      <div>
                                        <Label className="text-sm font-medium">Previous Notes</Label>
                                        <p className="text-sm bg-muted p-2 rounded">{selectedApplication.admin_notes}</p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applications?.length || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">
                  {applications?.filter(app => app.application_status === 'pending').length || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">
                  {applications?.filter(app => app.application_status === 'approved').length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">
                  {applications?.filter(app => app.application_status === 'rejected').length || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostApplicationManagement;
