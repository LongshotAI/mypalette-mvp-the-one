import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, DollarSign, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SubmissionFormFields from '@/components/submissions/SubmissionFormFields';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import { useSubmissionPricing, formatPricingDisplay } from '@/hooks/useSubmissionPricing';
import { toast } from '@/hooks/use-toast';
import { SubmissionData } from '@/types/submission';

interface SubmissionWizardProps {
  openCallId: string;
  onSuccess?: () => void;
}

const SubmissionWizard = ({ openCallId, onSuccess }: SubmissionWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const { createSubmission } = useSubmissions();
  const { getOpenCallById } = useOpenCalls();
  const { pricingInfo, isLoadingPricing, updatePricing } = useSubmissionPricing(openCallId);
  const openCallQuery = getOpenCallById(openCallId);

  const steps = [
    { title: 'Artwork Details', description: 'Basic information about your submission' },
    { title: 'Review & Submit', description: 'Review your submission and submit' }
  ];

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (!submissionData.title || !submissionData.description || !submissionData.medium) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields (title, description, medium).",
          variant: "destructive"
        });
        return false;
      }
      if (submissionData.image_urls.length === 0) {
        toast({
          title: "Missing Images",
          description: "Please add at least one image of your artwork.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleDataChange = (data: SubmissionData) => {
    setSubmissionData(data);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    // Check if user can submit based on pricing
    if (!pricingInfo?.canSubmit) {
      toast({
        title: "Submission Limit Reached",
        description: "You have reached the maximum number of submissions (6) for this open call.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting artwork to open call:', openCallId, submissionData);
      
      // Determine if this is a free submission
      const isFreeSubmission = (pricingInfo?.freeRemaining || 0) > 0;
      
      // Update pricing tracking first
      await updatePricing.mutateAsync({ isFreebies: isFreeSubmission });
      
      const result = await createSubmission.mutateAsync({
        openCallId,
        submissionData
      });

      if (!isFreeSubmission && pricingInfo?.nextSubmissionCost && pricingInfo.nextSubmissionCost > 0) {
        toast({
          title: "Payment Required",
          description: `Your submission fee of $${pricingInfo.nextSubmissionCost} has been processed.`,
        });
      } else {
        toast({
          title: "Free Submission Successful",
          description: "Your artwork has been submitted successfully!",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit your artwork. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (openCallQuery.isLoading || isLoadingPricing) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading open call details...</p>
      </div>
    );
  }

  if (openCallQuery.error || !openCallQuery.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load open call details. Please try again.</p>
      </div>
    );
  }

  const openCall = openCallQuery.data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Submit to "{openCall.title}"</h1>
        <p className="text-muted-foreground mb-4">{openCall.organization_name}</p>
        
        {/* Pricing Info */}
        {pricingInfo && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div className="text-center">
                  <p className="font-medium">{formatPricingDisplay(pricingInfo)}</p>
                  <p className="text-sm text-muted-foreground">
                    {pricingInfo.totalSubmissions} of 6 total submissions used
                  </p>
                </div>
              </div>
              
              {!pricingInfo.canSubmit && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have reached the maximum of 6 submissions for this open call.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Step {currentStep + 1} of {steps.length}</h3>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-4" />
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 ${
                  index < currentStep ? 'bg-primary border-primary text-white' :
                  index === currentStep ? 'border-primary' : 'border-muted-foreground'
                }`}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-xs">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <SubmissionFormFields
              submissionData={submissionData}
              onDataChange={handleDataChange}
              requirements={openCall.submission_requirements}
            />
          )}
          
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Review Your Submission</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Artwork Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Title:</strong> {submissionData.title}</p>
                    <p><strong>Medium:</strong> {submissionData.medium}</p>
                    {submissionData.year && <p><strong>Year:</strong> {submissionData.year}</p>}
                    {submissionData.dimensions && <p><strong>Dimensions:</strong> {submissionData.dimensions}</p>}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {submissionData.image_urls.slice(0, 4).map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Artwork ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                  {submissionData.image_urls.length > 4 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      +{submissionData.image_urls.length - 4} more images
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{submissionData.description}</p>
              </div>

              {submissionData.artist_statement && (
                <div>
                  <h4 className="font-medium mb-2">Artist Statement</h4>
                  <p className="text-sm text-muted-foreground">{submissionData.artist_statement}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !pricingInfo?.canSubmit}
          >
            {isSubmitting ? 'Submitting...' : 
             pricingInfo?.freeRemaining ? 'Submit Artwork (Free)' : 
             pricingInfo?.nextSubmissionCost ? `Submit Artwork ($${pricingInfo.nextSubmissionCost})` :
             'Submit Artwork'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubmissionWizard;
