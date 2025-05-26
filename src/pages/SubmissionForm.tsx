
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calendar, DollarSign, Send, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import SubmissionFormFields from '@/components/submissions/SubmissionFormFields';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SubmissionData } from '@/types/submission';

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
    external_links: [],
    files: []
  });

  // Fetch open call details
  const { data: openCall, isLoading } = useQuery({
    queryKey: ['open-call', callId],
    queryFn: async () => {
      if (!callId) throw new Error('No call ID provided');
      
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            username
          )
        `)
        .eq('id', callId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!callId,
  });

  // Check existing submissions
  const { data: existingSubmissions } = useQuery({
    queryKey: ['user-submissions', callId, user?.id],
    queryFn: async () => {
      if (!callId || !user?.id) return [];
      
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('open_call_id', callId)
        .eq('artist_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!callId && !!user?.id,
  });

  // Submit submission
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!callId || !user?.id) throw new Error('Missing required data');

      // Validate form
      if (!submissionData.title.trim()) {
        throw new Error('Artwork title is required');
      }
      if (!submissionData.description.trim()) {
        throw new Error('Artwork description is required');
      }
      if (!submissionData.medium) {
        throw new Error('Medium is required');
      }
      if (submissionData.image_urls.length === 0) {
        throw new Error('At least one image is required');
      }

      // Convert to proper format for database
      const submissionPayload = {
        open_call_id: callId,
        artist_id: user.id,
        submission_data: submissionData as any, // Cast to any to satisfy Json type
        payment_status: openCall?.submission_fee > 0 ? 'pending' : 'free'
      };

      const { data, error } = await supabase
        .from('submissions')
        .insert(submissionPayload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Submission Successful!",
        description: "Your artwork has been submitted successfully.",
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const handleDataChange = (data: SubmissionData) => {
    setSubmissionData(data);
  };

  const isDeadlinePassed = openCall && new Date(openCall.submission_deadline) < new Date();
  const hasExistingSubmission = existingSubmissions && existingSubmissions.length > 0;
  const canSubmit = !isDeadlinePassed && !hasExistingSubmission && openCall?.status === 'live';

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
              <SubmissionFormFields
                submissionData={submissionData}
                onDataChange={handleDataChange}
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
                          disabled={submitMutation.isPending}
                          size="lg"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {submitMutation.isPending ? 'Submitting...' : 'Submit Artwork'}
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
