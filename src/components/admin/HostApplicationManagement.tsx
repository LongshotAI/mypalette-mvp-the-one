
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useHostApplications, HostApplication } from '@/hooks/useHostApplications';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const HostApplicationManagement = () => {
  const [selectedApplication, setSelectedApplication] = useState<HostApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const queryClient = useQueryClient();
  const { getAllHostApplications, updateHostApplicationStatus } = useHostApplications();

  const { data: applications, isLoading } = getAllHostApplications;

  const handleStatusUpdate = (applicationId: string, status: string, notes?: string) => {
    updateHostApplicationStatus.mutate({
      applicationId,
      status,
      notes
    }, {
      onSuccess: () => {
        setReviewNotes('');
        setSelectedApplication(null);
      }
    });
  };

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
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Host Applications ({applications?.length || 0})
        </h3>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">
            Pending: {applications?.filter(a => a.application_status === 'pending').length || 0}
          </Badge>
          <Badge variant="outline">
            Approved: {applications?.filter(a => a.application_status === 'approved').length || 0}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {applications?.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {application.proposed_title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    by {application.organization_name} ({application.organization_type})
                  </p>
                  <p className="text-xs text-gray-500">
                    Applied: {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(application.application_status)}>
                    {getStatusIcon(application.application_status)}
                    {application.application_status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 line-clamp-3">
                {application.proposed_description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Deadline:</span>
                  <p>{new Date(application.proposed_deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium">Budget:</span>
                  <p>${application.proposed_budget || 0}</p>
                </div>
                <div>
                  <span className="font-medium">Prize:</span>
                  <p>${application.proposed_prize_amount || 0}</p>
                </div>
                <div>
                  <span className="font-medium">Target:</span>
                  <p>{application.target_submissions} submissions</p>
                </div>
              </div>

              {application.admin_notes && (
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <strong>Admin Notes:</strong> {application.admin_notes}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Host Application: {application.proposed_title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Organization</h4>
                          <p><strong>Name:</strong> {application.organization_name}</p>
                          <p><strong>Type:</strong> {application.organization_type}</p>
                          <p><strong>Website:</strong> {application.website_url || 'Not provided'}</p>
                          <p><strong>Contact:</strong> {application.contact_email}</p>
                          <p><strong>Phone:</strong> {application.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Proposal Details</h4>
                          <p><strong>Theme:</strong> {application.proposed_theme || 'Not specified'}</p>
                          <p><strong>Venue:</strong> {application.proposed_venue || 'Not specified'}</p>
                          <p><strong>Exhibition Dates:</strong> {application.proposed_exhibition_dates || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">Description</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {application.proposed_description}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">Experience</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {application.experience_description}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">Curatorial Statement</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {application.curatorial_statement}
                        </p>
                      </div>

                      {application.previous_exhibitions && (
                        <div>
                          <h4 className="font-semibold">Previous Exhibitions</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {application.previous_exhibitions}
                          </p>
                        </div>
                      )}

                      {application.technical_requirements && (
                        <div>
                          <h4 className="font-semibold">Technical Requirements</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {application.technical_requirements}
                          </p>
                        </div>
                      )}

                      {application.marketing_plan && (
                        <div>
                          <h4 className="font-semibold">Marketing Plan</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {application.marketing_plan}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {application.application_status === 'pending' && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="default">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approve Application</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Admin Notes (Optional)</Label>
                            <Textarea
                              placeholder="Add any notes about the approval"
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={() => handleStatusUpdate(application.id, 'approved', reviewNotes)}
                            className="w-full"
                          >
                            Approve Application
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Application</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Rejection Reason</Label>
                            <Textarea
                              placeholder="Explain why this application is being rejected"
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={() => handleStatusUpdate(application.id, 'rejected', reviewNotes)}
                            variant="destructive"
                            className="w-full"
                          >
                            Reject Application
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applications?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No host applications yet.</p>
        </div>
      )}
    </div>
  );
};

export default HostApplicationManagement;
