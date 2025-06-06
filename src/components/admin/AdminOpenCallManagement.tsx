
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Users, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import { useSubmissions } from '@/hooks/useSubmissions';
import { toast } from '@/hooks/use-toast';

const AdminOpenCallManagement = () => {
  const { getOpenCalls } = useOpenCalls();
  const { updateSubmissionStatus } = useSubmissions();
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const openCallsQuery = getOpenCalls;

  const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
    try {
      await updateSubmissionStatus.mutateAsync({
        submissionId,
        status: newStatus,
        notes: actionNotes
      });
      setActionNotes('');
      toast({
        title: "Status Updated",
        description: "Submission status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
    }
  };

  const handleRefresh = () => {
    openCallsQuery.refetch();
    toast({
      title: "Refreshed",
      description: "Open calls data has been refreshed.",
    });
  };

  if (openCallsQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading open calls...</p>
        </CardContent>
      </Card>
    );
  }

  if (openCallsQuery.error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error loading open calls. Please try again.</p>
          <Button onClick={handleRefresh} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const openCalls = openCallsQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Open Call Management</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open Calls List */}
        <div className="lg:col-span-2 space-y-4">
          {openCalls.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Open Calls</h3>
                <p className="text-muted-foreground">No open calls are currently available.</p>
              </CardContent>
            </Card>
          ) : (
            openCalls.map((openCall: any) => (
              <Card key={openCall.id} className={selectedCall === openCall.id ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{openCall.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {openCall.organization_name}
                      </p>
                    </div>
                    <Badge variant={openCall.status === 'live' ? 'default' : 'secondary'}>
                      {openCall.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm line-clamp-2">{openCall.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(openCall.submission_deadline).toLocaleDateString()}
                      </div>
                      {openCall.submission_fee > 0 && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${openCall.submission_fee}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {openCall.max_submissions} max
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={selectedCall === openCall.id ? 'default' : 'outline'}
                        onClick={() => setSelectedCall(openCall.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {selectedCall === openCall.id ? 'Selected' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Selected Open Call Details */}
        <div className="space-y-4">
          {selectedCall ? (
            <OpenCallDetails callId={selectedCall} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select an Open Call</h3>
                <p className="text-muted-foreground text-sm">
                  Choose an open call from the list to view details and manage submissions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const OpenCallDetails = ({ callId }: { callId: string }) => {
  const { getSubmissionsByCall } = useSubmissions();
  const submissionsQuery = getSubmissionsByCall(callId);

  if (submissionsQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm">Loading submissions...</p>
        </CardContent>
      </Card>
    );
  }

  const submissions = submissionsQuery.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Submissions ({submissions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No submissions yet
            </p>
          ) : (
            submissions.slice(0, 5).map((submission: any) => (
              <div key={submission.id} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">
                      {submission.submission_data?.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {submission.profiles?.first_name} {submission.profiles?.last_name}
                    </p>
                  </div>
                  <Badge size="sm" variant="outline">
                    {submission.payment_status}
                  </Badge>
                </div>
                
                {submission.submission_data?.image_urls?.[0] && (
                  <img
                    src={submission.submission_data.image_urls[0]}
                    alt="Submission"
                    className="w-full h-20 object-cover rounded"
                  />
                )}
              </div>
            ))
          )}
          
          {submissions.length > 5 && (
            <p className="text-xs text-muted-foreground text-center">
              +{submissions.length - 5} more submissions
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOpenCallManagement;
