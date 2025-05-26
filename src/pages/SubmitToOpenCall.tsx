
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Users, Upload, ArrowLeft } from 'lucide-react';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useAuth } from '@/contexts/AuthContext';

const SubmitToOpenCall = () => {
  const { callId } = useParams<{ callId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artistStatement: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getOpenCallById } = useOpenCalls();
  const { data: openCall, isLoading } = getOpenCallById(callId || '');
  const { createSubmission } = useSubmissions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callId || !user) return;

    setIsSubmitting(true);
    try {
      const result = await createSubmission.mutateAsync({
        openCallId: callId,
        submissionData: formData
      });

      if (result.paymentRequired && result.clientSecret) {
        // Redirect to payment page with client secret
        // For now, we'll just show success
        navigate('/submissions', { 
          state: { message: 'Submission created! Payment processing...' }
        });
      } else {
        navigate('/submissions', { 
          state: { message: 'Free submission created successfully!' }
        });
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!openCall) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Open Call Not Found</h1>
            <p className="text-muted-foreground mb-4">The open call you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/open-calls')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Open Calls
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isDeadlinePassed = new Date(openCall.submission_deadline) < new Date();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/open-calls')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Open Calls
        </Button>

        {/* Open Call Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{openCall.title}</CardTitle>
                <p className="text-muted-foreground">{openCall.organization_name}</p>
              </div>
              <Badge variant={isDeadlinePassed ? "destructive" : "default"}>
                {isDeadlinePassed ? 'Closed' : 'Open'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{openCall.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(openCall.submission_deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fee</p>
                  <p className="text-sm text-muted-foreground">
                    {openCall.submission_fee === 0 ? 'Free first submission' : `$${openCall.submission_fee}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Max Submissions</p>
                  <p className="text-sm text-muted-foreground">{openCall.max_submissions}</p>
                </div>
              </div>
            </div>

            {openCall.submission_requirements && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Submission Requirements</h4>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(openCall.submission_requirements, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission Form */}
        {!isDeadlinePassed ? (
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Work</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below to submit your artwork to this open call.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Artwork Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="Enter the title of your artwork"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    placeholder="Describe your artwork, including medium, dimensions, and concept"
                  />
                </div>

                <div>
                  <Label htmlFor="artistStatement">Artist Statement *</Label>
                  <Textarea
                    id="artistStatement"
                    value={formData.artistStatement}
                    onChange={(e) => setFormData(prev => ({ ...prev, artistStatement: e.target.value }))}
                    required
                    rows={4}
                    placeholder="Explain your artistic process, inspiration, and how this work relates to the open call theme"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <p className="font-medium text-blue-900">File Upload</p>
                  </div>
                  <p className="text-sm text-blue-700">
                    File upload functionality will be implemented in the next phase. 
                    For now, please include file details in your description.
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Submission Fee:</strong> Your first submission is free! 
                    Additional submissions to this call are $2 each.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !user}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Artwork'}
                </Button>

                {!user && (
                  <p className="text-center text-sm text-muted-foreground">
                    Please{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto"
                      onClick={() => navigate('/auth/login')}
                    >
                      sign in
                    </Button>
                    {' '}to submit your artwork.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Submission Deadline Passed</h3>
              <p className="text-muted-foreground mb-4">
                This open call is no longer accepting submissions.
              </p>
              <Button onClick={() => navigate('/open-calls')}>
                Browse Other Open Calls
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SubmitToOpenCall;
