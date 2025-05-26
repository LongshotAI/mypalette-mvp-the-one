
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
import { ArrowLeft, Upload, DollarSign, Calendar, Info, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import SubmissionPricing from '@/components/open-calls/SubmissionPricing';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

const SubmissionFormContent = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSubmission } = useSubmissions();
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

  useEffect(() => {
    if (callId) {
      fetchOpenCall();
      checkUserSubmissions();
    }
  }, [callId]);

  const fetchOpenCall = async () => {
    const { data, error } = await supabase
      .from('open_calls')
      .select('*')
      .eq('id', callId)
      .single();

    if (error) {
      console.error('Error fetching open call:', error);
      return;
    }

    setOpenCall(data);
  };

  const checkUserSubmissions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('open_call_id', callId)
      .eq('artist_id', user.id);

    if (!error) {
      setSubmissionCount(data?.length || 0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSubmission(prev => ({ 
        ...prev, 
        files: Array.from(e.target.files || [])
      }));
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

    if (!submission.title || !submission.description || !submission.artistStatement) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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

      if (result.paymentRequired && result.clientSecret) {
        setClientSecret(result.clientSecret);
        setSubmissionId(result.submissionId);
      } else {
        // Free submission successful
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
      // Update submission status
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
    navigate(`/open-calls/${callId}`);
  };

  if (!openCall) {
    return <Layout><div>Loading...</div></Layout>;
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
                        <Label htmlFor="files">Upload Artwork *</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your files here, or click to browse
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button variant="outline" size="sm" asChild>
                            <label htmlFor="file-upload">Select Files</label>
                          </Button>
                        </div>
                        {submission.files.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              {submission.files.length} file(s) selected
                            </p>
                          </div>
                        )}
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
