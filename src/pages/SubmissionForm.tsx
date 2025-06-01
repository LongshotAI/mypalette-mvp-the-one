
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

const SubmissionForm = () => {
  const { callId } = useParams<{ callId: string }>();
  const navigate = useNavigate();
  const { createSubmission } = useSubmissions();
  const { getOpenCallById } = useOpenCalls();
  
  const { data: openCall, isLoading: loadingCall } = getOpenCallById(callId || '');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    year: '',
    dimensions: '',
    artist_statement: '',
    image_urls: [''],
    external_links: ['']
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.image_urls];
    newUrls[index] = value;
    setFormData(prev => ({ ...prev, image_urls: newUrls }));
  };

  const addImageUrl = () => {
    setFormData(prev => ({ ...prev, image_urls: [...prev.image_urls, ''] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callId) return;
    
    setIsSubmitting(true);
    
    try {
      await createSubmission.mutateAsync({
        openCallId: callId,
        submissionData: {
          ...formData,
          image_urls: formData.image_urls.filter(url => url.trim() !== ''),
          external_links: formData.external_links.filter(url => url.trim() !== '')
        }
      });
      
      toast({
        title: "Submission Successful!",
        description: "Your artwork has been submitted successfully.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit artwork.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCall) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
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
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Open Call Not Found</h2>
              <Button onClick={() => navigate('/open-calls')}>
                Browse Open Calls
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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Submit to: {openCall.title}</CardTitle>
              <p className="text-muted-foreground">
                Organization: {openCall.organization_name}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Artwork Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medium">Medium *</Label>
                    <Input
                      id="medium"
                      value={formData.medium}
                      onChange={(e) => handleInputChange('medium', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    placeholder="e.g., 24 x 36 inches"
                  />
                </div>

                <div>
                  <Label>Image URLs *</Label>
                  {formData.image_urls.map((url, index) => (
                    <div key={index} className="mt-2">
                      <Input
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="Enter image URL"
                        required={index === 0}
                      />
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addImageUrl}
                    className="mt-2"
                  >
                    Add Another Image
                  </Button>
                </div>

                <div>
                  <Label htmlFor="artist_statement">Artist Statement *</Label>
                  <Textarea
                    id="artist_statement"
                    value={formData.artist_statement}
                    onChange={(e) => handleInputChange('artist_statement', e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/open-calls')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Artwork'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionForm;
