
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Building,
  Calendar,
  DollarSign,
  Users,
  Globe,
  Award,
  FileText,
  Eye
} from 'lucide-react';
import { useHostApplications, HostApplication } from '@/hooks/useHostApplications';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const HostApplicationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<HostApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const { getAllHostApplications, updateHostApplicationStatus } = useHostApplications();
  
  const { data: applications, isLoading } = getAllHostApplications;

  const filteredApplications = applications?.filter(app => {
    const matchesSearch = 
      app.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.proposed_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'under_review': return Clock;
      default: return Clock;
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      await updateHostApplicationStatus.mutateAsync({
        applicationId,
        status: newStatus,
        notes
      });
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  const getApplicationStats = () => {
    if (!applications) return { total: 0, pending: 0, approved: 0, rejected: 0 };
    
    return {
      total: applications.length,
      pending: applications.filter(app => app.application_status === 'pending').length,
      approved: applications.filter(app => app.application_status === 'approved').length,
      rejected: applications.filter(app => app.application_status === 'rejected').length,
    };
  };

  const stats = getApplicationStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Host Applications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-6">
        {filteredApplications.map((application, index) => {
          const StatusIcon = getStatusIcon(application.application_status);
          
          return (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        {application.organization_name}
                      </CardTitle>
                      <p className="text-muted-foreground">{application.organization_type}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Applied: {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(application.application_status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {application.application_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{application.proposed_title}</h4>
                    <p className="text-muted-foreground line-clamp-2">
                      {application.proposed_description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Deadline: {new Date(application.proposed_deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Prize: {application.proposed_prize_amount 
                          ? `$${application.proposed_prize_amount.toLocaleString()}`
                          : 'Not specified'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Target: {application.target_submissions} submissions</span>
                    </div>
                    {application.website_url && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={application.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{application.organization_name} - Host Application</DialogTitle>
                        </DialogHeader>
                        
                        {selectedApplication && (
                          <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="experience">Experience</TabsTrigger>
                              <TabsTrigger value="requirements">Requirements</TabsTrigger>
                              <TabsTrigger value="review">Review</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="details" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Organization Info</h4>
                                  <p><strong>Name:</strong> {selectedApplication.organization_name}</p>
                                  <p><strong>Type:</strong> {selectedApplication.organization_type}</p>
                                  <p><strong>Contact:</strong> {selectedApplication.contact_email}</p>
                                  {selectedApplication.phone && <p><strong>Phone:</strong> {selectedApplication.phone}</p>}
                                  {selectedApplication.website_url && (
                                    <p><strong>Website:</strong> 
                                      <a href={selectedApplication.website_url} target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
                                        {selectedApplication.website_url}
                                      </a>
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold">Open Call Details</h4>
                                  <p><strong>Title:</strong> {selectedApplication.proposed_title}</p>
                                  <p><strong>Deadline:</strong> {new Date(selectedApplication.proposed_deadline).toLocaleDateString()}</p>
                                  {selectedApplication.proposed_exhibition_dates && (
                                    <p><strong>Exhibition:</strong> {selectedApplication.proposed_exhibition_dates}</p>
                                  )}
                                  {selectedApplication.proposed_venue && (
                                    <p><strong>Venue:</strong> {selectedApplication.proposed_venue}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold">Description</h4>
                                <p className="text-sm text-muted-foreground">{selectedApplication.proposed_description}</p>
                              </div>
                              
                              {selectedApplication.proposed_theme && (
                                <div>
                                  <h4 className="font-semibold">Theme</h4>
                                  <p className="text-sm text-muted-foreground">{selectedApplication.proposed_theme}</p>
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="experience" className="space-y-4">
                              <div>
                                <h4 className="font-semibold">Experience Description</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.experience_description}</p>
                              </div>
                              
                              {selectedApplication.previous_exhibitions && (
                                <div>
                                  <h4 className="font-semibold">Previous Exhibitions</h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.previous_exhibitions}</p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-semibold">Curatorial Statement</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.curatorial_statement}</p>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="requirements" className="space-y-4">
                              {selectedApplication.technical_requirements && (
                                <div>
                                  <h4 className="font-semibold">Technical Requirements</h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.technical_requirements}</p>
                                </div>
                              )}
                              
                              {selectedApplication.marketing_plan && (
                                <div>
                                  <h4 className="font-semibold">Marketing Plan</h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.marketing_plan}</p>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4">
                                {selectedApplication.proposed_budget && (
                                  <div>
                                    <h4 className="font-semibold">Budget</h4>
                                    <p>${selectedApplication.proposed_budget.toLocaleString()}</p>
                                  </div>
                                )}
                                
                                {selectedApplication.proposed_prize_amount && (
                                  <div>
                                    <h4 className="font-semibold">Prize Amount</h4>
                                    <p>${selectedApplication.proposed_prize_amount.toLocaleString()}</p>
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="review" className="space-y-4">
                              {/* Review Status */}
                              <div className="p-4 bg-muted/30 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold">Application Status</h4>
                                  <Badge className={getStatusColor(selectedApplication.application_status)}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {selectedApplication.application_status}
                                  </Badge>
                                </div>
                                
                                {selectedApplication.reviewed_at && (
                                  <div className="text-sm">
                                    <p><strong>Reviewed:</strong> {new Date(selectedApplication.reviewed_at).toLocaleDateString()}</p>
                                    {selectedApplication.admin_notes && (
                                      <div className="mt-2">
                                        <strong>Admin Notes:</strong>
                                        <p className="text-muted-foreground mt-1">{selectedApplication.admin_notes}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="reviewNotes">Review Notes</Label>
                                <Textarea
                                  id="reviewNotes"
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Add notes about this application..."
                                  rows={4}
                                />
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleStatusUpdate(selectedApplication.id, 'approved', reviewNotes)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected', reviewNotes)}
                                  variant="destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => handleStatusUpdate(selectedApplication.id, 'under_review', reviewNotes)}
                                  variant="outline"
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mark Under Review
                                </Button>
                              </div>
                              
                              {selectedApplication.admin_notes && (
                                <div className="mt-4 p-4 bg-muted rounded">
                                  <h4 className="font-semibold">Previous Notes</h4>
                                  <p className="text-sm text-muted-foreground">{selectedApplication.admin_notes}</p>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>

                    {application.application_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(application.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No host applications have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostApplicationManagement;
