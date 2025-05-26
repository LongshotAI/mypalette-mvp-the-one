
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DollarSign, Calendar, Info, CreditCard, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useSubmissionFiles } from '@/hooks/useSubmissionFiles';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import SubmissionPricing from '@/components/open-calls/SubmissionPricing';
import FileUploadZone from '@/components/submissions/FileUploadZone';
import { Alert, AlertDescription } from '@/components/ui/alert';

const stripePromise = loadStripe('pk_test_placeholder');

const SubmissionFormContent = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSubmission } = useSubmissions();
  const { uploadFiles } = useSubmissionFiles();
  const stripe = useStripe();
  const elements = useElements();
  
  const [submission, setSubmission] = useState({
    title: '',
    description: '',
    artistStatement: '',
    files: [] as File[]
  });
  
  const [openCall, setOpenCall] = useState<any>(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    if (callId) {
      if (!isValidUUID(callId)) {
        setError('Invalid open call ID format. Please check the URL.');
        setLoading(false);
        return;
      }
      
      fetchOpenCall();
      checkUserSubmissions();
    }
  }, [callId]);

  const fetchOpenCall = async () => {
    try {
      if (!callId || !isValidUUID(callId)) {
        throw new Error('Invalid open call ID');
      }

      const { data, error } = await supabase
        .from('open_calls')
        .select('*')
        .eq('id', callId)
        .single();

      if (error) {
        console.error('Error fetching open call:', error);
        if (error.code === 'PGRST116') {
          setError('Open call not found.');
        } else {
          setError('Failed to load open call details.');
        }
        return;
      }

      setOpenCall(data);
    } catch (err) {
      console.error('Error in fetchOpenCall:', err);
      setError('Failed to load open call details.');
    } finally {
      setLoading(false);
    }
  };

  const checkUserSubmissions = async () => {
    if (!user || !callId || !isValidUUID(callId)) return;
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('open_call_id', callId)
        .eq('artist_id', user.id);

      if (!error) {
        setSubmissionCount(data?.length || 0);
      }
    } catch (err) {
      console.error('Error checking user submissions:', err);
    }
  };

  const handleSubmit = async () => {
    if (!user || !callId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your work.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUUID(callId)) {
      toast({
        title: "Invalid Open Call",
        description: "This open call ID is not valid.",
        variant: "destructive",
      });
      return;
    }

    if (!submission.title || !submission.description || !submission.artistStatement) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (submission.files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please upload at least one artwork file.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createSubmission.mutateAsync({
        openCallId: callId,
        submissionData: submission
      });

      if (result.submissionId && submission.files.length > 0) {
        await uploadFiles.mutateAsync({
          submissionId: result.submissionId,
          files: submission.files
        });
      }

      if (result.paymentRequired && result.clientSecret) {
        setClientSecret(result.clientSecret);
        setSubmissionId(result.submissionId);
      } else {
        toast({
          title: "Submission Successful",
          description: "Your free submission has been created!",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: user?.email,
        },
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await supabase
        .from('submissions')
        .update({ payment_status: 'paid' })
        .eq('id', submissionId);

      toast({
        title: "Payment Successful",
        description: "Your submission has been completed!",
      });
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (callId && isValidUUID(callId)) {
      navigate(`/open-calls/${callId}`);
    } else {
      navigate('/open-calls');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button variant="outline" onClick={() => navigate('/open-calls')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Calls
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!openCall) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Open Call Not Found</h1>
            <p className="text-muted-foreground mb-6">The open call you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/open-calls')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Calls
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Submit Your Work</h1>
              <p className="text-muted-foreground">Submit to: {openCall.title}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {!clientSecret ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Artwork Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="title">Artwork Title *</Label>
                        <Input
                          id="title"
                          value={submission.title}
                          onChange={(e) => setSubmission(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter artwork title"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Artwork Description *</Label>
                        <Textarea
                          id="description"
                          value={submission.description}
                          onChange={(e) => setSubmission(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your artwork"
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label>Upload Artwork Files *</Label>
                        <FileUploadZone
                          onFilesSelected={(files) => setSubmission(prev => ({ ...prev, files }))}
                          selectedFiles={submission.files}
                          maxFiles={5}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Artist Statement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="artistStatement">Artist Statement *</Label>
                        <Textarea
                          id="artistStatement"
                          value={submission.artistStatement}
                          onChange={(e) => setSubmission(prev => ({ ...prev, artistStatement: e.target.value }))}
                          placeholder="Provide context about your work and artistic practice"
                          rows={6}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Complete Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                          },
                        }}
                      />
                    </div>
                    <Button onClick={handlePayment} className="w-full" size="lg">
                      Pay $2.00
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <SubmissionPricing
                currentSubmissions={submissionCount}
                maxSubmissions={6}
                onSubmit={handleSubmit}
              />

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Submission Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Fee: Free first submission, then $2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Deadline: {new Date(openCall.submission_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const SubmissionForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <SubmissionFormContent />
    </Elements>
  );
};

export default SubmissionForm;
