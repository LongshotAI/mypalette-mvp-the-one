
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calendar, DollarSign, Send, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import AdvancedSubmissionForm from '@/components/submissions/AdvancedSubmissionForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SubmissionData } from '@/types/submission';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import { useSubmissions } from '@/hooks/useSubmissions';

const SubmissionForm = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    title: '',
    description: '',
    medium: '',
    year: '',
    dimensions: '',
    artist_statement: '',
    image_urls: [],
    external_links: []
  });

  const { getOpenCallById } = useOpenCalls();
  const { createSubmission } = useSubmissions();
  
  const { data: openCall, isLoading } = getOpenCallById(callId || '');

  // Check existing submissions for this user and open call
  const { data: existingSubmissions } = useSubmissions().getUserSubmissions;
  
  const hasExistingSubmission = existingSubmissions?.some(
    sub => sub.open_call_id === callId
  );

  const handleSubmit = async () => {
    if (!callId || !user?.id) {
      console.error('Missing required data for submission');
      return;
    }

    try {
      await createSubmission.mutateAsync({
        openCallId: callId,
        submissionData
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const isDeadlinePassed = openCall && new Date(openCall.submission_deadline) < new Date();
  const canSubmit = !isDeadlinePassed && !hasExistingSubmission && openCall?.status === 'live';

  // Validation for submit button
  const isFormValid = () => {
    return !!(
      submissionData.title?.trim() &&
      submissionData.description?.trim() &&
      submissionData.medium &&
      submissionData.year?.trim() &&
      submissionData.artist_statement?.trim() &&
      submissionData.image_urls?.length > 0
    );
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

  if (!openCall) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Open Call Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The open call you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/open-calls')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Open Calls
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(`/open-calls/${callId}`)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Call
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Submit to: {openCall.title}</h1>
            <p className="text-muted-foreground">
              Hosted by {openCall.profiles?.first_name} {openCall.profiles?.last_name}
            </p>
          </motion.div>

          {/* Alerts */}
          {!canSubmit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {isDeadlinePassed && "This open call has passed its submission deadline."}
                  {hasExistingSubmission && "You have already submitted to this open call."}
                  {openCall.status !== 'live' && "This open call is not currently accepting submissions."}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Submission Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <AdvancedSubmissionForm
                submissionData={submissionData}
                onDataChange={setSubmissionData}
                requirements={openCall.submission_requirements}
              />

              {canSubmit && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Ready to submit?</h3>
                          <p className="text-sm text-muted-foreground">
                            Review your submission and click submit when ready.
                          </p>
                        </div>
                        <Button 
                          onClick={handleSubmit}
                          disabled={createSubmission.isPending || !isFormValid()}
                          size="lg"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {createSubmission.isPending ? 'Submitting...' : 'Submit Artwork'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Open Call Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Open Call Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{openCall.title}</h4>
                    <p className="text-sm text-muted-foreground">{openCall.description}</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(openCall.submission_deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Submission Fee</p>
                        <p className="text-sm text-muted-foreground">
                          {openCall.submission_fee > 0 ? `$${openCall.submission_fee}` : 'Free'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Status</p>
                      <Badge variant={openCall.status === 'live' ? 'default' : 'secondary'}>
                        {openCall.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {openCall.submission_requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      {typeof openCall.submission_requirements === 'object' && 
                        Object.entries(openCall.submission_requirements).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))
                      }
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionForm;
