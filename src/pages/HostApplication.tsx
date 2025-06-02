import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  Users, 
  Building, 
  Globe,
  Award,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useHostApplications, HostApplicationData } from '@/hooks/useHostApplications';

const HostApplication = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createHostApplication } = useHostApplications();
  
  const [formData, setFormData] = useState<HostApplicationData>({
    organizationName: '',
    organizationType: '',
    websiteUrl: '',
    contactEmail: user?.email || '',
    phone: '',
    address: '',
    proposedTitle: '',
    proposedDescription: '',
    proposedTheme: '',
    proposedDeadline: '',
    proposedExhibitionDates: '',
    proposedVenue: '',
    proposedBudget: undefined,
    proposedPrizeAmount: undefined,
    targetSubmissions: 100,
    experienceDescription: '',
    previousExhibitions: '',
    curatorialStatement: '',
    technicalRequirements: '',
    marketingPlan: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field: keyof HostApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await createHostApplication.mutateAsync(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Host application submission failed:', error);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.organizationName && formData.organizationType && formData.contactEmail);
      case 2:
        return !!(formData.proposedTitle && formData.proposedDescription && formData.proposedDeadline);
      case 3:
        return !!(formData.experienceDescription && formData.curatorialStatement);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">Organization Information</h2>
              <p className="text-muted-foreground">Tell us about your organization</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  placeholder="e.g., Modern Art Gallery NYC"
                />
              </div>

              <div>
                <Label htmlFor="organizationType">Organization Type *</Label>
                <Select 
                  value={formData.organizationType} 
                  onValueChange={(value) => handleInputChange('organizationType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gallery">Art Gallery</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="festival">Art Festival</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                    <SelectItem value="university">University/Institution</SelectItem>
                    <SelectItem value="private">Private Collector</SelectItem>
                    <SelectItem value="online">Online Platform</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://yourorganization.com"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="contact@organization.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Art Street, City, State, ZIP"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">Open Call Details</h2>
              <p className="text-muted-foreground">Define your open call opportunity</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="proposedTitle">Open Call Title *</Label>
                <Input
                  id="proposedTitle"
                  value={formData.proposedTitle}
                  onChange={(e) => handleInputChange('proposedTitle', e.target.value)}
                  placeholder="e.g., Digital Futures Art Exhibition 2024"
                />
              </div>

              <div>
                <Label htmlFor="proposedDescription">Description *</Label>
                <Textarea
                  id="proposedDescription"
                  value={formData.proposedDescription}
                  onChange={(e) => handleInputChange('proposedDescription', e.target.value)}
                  placeholder="Describe your open call, what you're looking for, and what artists can expect..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="proposedTheme">Theme/Focus</Label>
                <Input
                  id="proposedTheme"
                  value={formData.proposedTheme}
                  onChange={(e) => handleInputChange('proposedTheme', e.target.value)}
                  placeholder="e.g., AI & Technology, Climate Change, Identity"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="proposedDeadline">Submission Deadline *</Label>
                  <Input
                    id="proposedDeadline"
                    type="date"
                    value={formData.proposedDeadline}
                    onChange={(e) => handleInputChange('proposedDeadline', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="proposedExhibitionDates">Exhibition Dates</Label>
                  <Input
                    id="proposedExhibitionDates"
                    value={formData.proposedExhibitionDates}
                    onChange={(e) => handleInputChange('proposedExhibitionDates', e.target.value)}
                    placeholder="e.g., March 15-30, 2024"
                  />
                </div>

                <div>
                  <Label htmlFor="proposedVenue">Venue/Location</Label>
                  <Input
                    id="proposedVenue"
                    value={formData.proposedVenue}
                    onChange={(e) => handleInputChange('proposedVenue', e.target.value)}
                    placeholder="Physical location or Online"
                  />
                </div>

                <div>
                  <Label htmlFor="targetSubmissions">Expected Submissions</Label>
                  <Input
                    id="targetSubmissions"
                    type="number"
                    value={formData.targetSubmissions}
                    onChange={(e) => handleInputChange('targetSubmissions', parseInt(e.target.value))}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="proposedBudget">Total Budget (USD)</Label>
                  <Input
                    id="proposedBudget"
                    type="number"
                    value={formData.proposedBudget || ''}
                    onChange={(e) => handleInputChange('proposedBudget', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="10000"
                  />
                </div>

                <div>
                  <Label htmlFor="proposedPrizeAmount">Prize Amount (USD)</Label>
                  <Input
                    id="proposedPrizeAmount"
                    type="number"
                    value={formData.proposedPrizeAmount || ''}
                    onChange={(e) => handleInputChange('proposedPrizeAmount', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">Experience & Vision</h2>
              <p className="text-muted-foreground">Share your curatorial vision and experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="experienceDescription">Your Experience *</Label>
                <Textarea
                  id="experienceDescription"
                  value={formData.experienceDescription}
                  onChange={(e) => handleInputChange('experienceDescription', e.target.value)}
                  placeholder="Describe your experience in curating, organizing exhibitions, or working with artists..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="previousExhibitions">Previous Exhibitions/Events</Label>
                <Textarea
                  id="previousExhibitions"
                  value={formData.previousExhibitions}
                  onChange={(e) => handleInputChange('previousExhibitions', e.target.value)}
                  placeholder="List notable exhibitions, events, or collaborations you've organized..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="curatorialStatement">Curatorial Statement *</Label>
                <Textarea
                  id="curatorialStatement"
                  value={formData.curatorialStatement}
                  onChange={(e) => handleInputChange('curatorialStatement', e.target.value)}
                  placeholder="Explain your curatorial vision, what you hope to achieve with this open call, and how it fits into the contemporary art landscape..."
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="technicalRequirements">Technical Requirements</Label>
                <Textarea
                  id="technicalRequirements"
                  value={formData.technicalRequirements}
                  onChange={(e) => handleInputChange('technicalRequirements', e.target.value)}
                  placeholder="Specify any technical requirements for submissions (file formats, dimensions, etc.)..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="marketingPlan">Marketing & Promotion Plan</Label>
                <Textarea
                  id="marketingPlan"
                  value={formData.marketingPlan}
                  onChange={(e) => handleInputChange('marketingPlan', e.target.value)}
                  placeholder="How do you plan to promote the open call and exhibition? Include social media, partnerships, press coverage..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold">Review & Submit</h2>
              <p className="text-muted-foreground">Review your application before submitting</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Name:</strong> {formData.organizationName}</p>
                  <p><strong>Type:</strong> {formData.organizationType}</p>
                  <p><strong>Contact:</strong> {formData.contactEmail}</p>
                  {formData.websiteUrl && <p><strong>Website:</strong> {formData.websiteUrl}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Open Call Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Title:</strong> {formData.proposedTitle}</p>
                  <p><strong>Deadline:</strong> {formData.proposedDeadline}</p>
                  {formData.proposedTheme && <p><strong>Theme:</strong> {formData.proposedTheme}</p>}
                  {formData.proposedPrizeAmount && <p><strong>Prize:</strong> ${formData.proposedPrizeAmount.toLocaleString()}</p>}
                  <p className="text-sm text-muted-foreground">{formData.proposedDescription}</p>
                </CardContent>
              </Card>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your application will be reviewed by our team within 5-7 business days. 
                  You'll receive an email notification once your application has been processed.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to submit a host application.
              </p>
              <Button onClick={() => navigate('/auth/login')}>
                Log In
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
              onClick={() => navigate('/open-calls')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Calls
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Host an Open Call</h1>
              <p className="text-muted-foreground mb-6">
                Submit your application to host an open call opportunity for artists
              </p>

              {/* Progress Steps */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                  <React.Fragment key={step}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                      ${step === currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : step < currentStep 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                      {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                    </div>
                    {step < totalSteps && (
                      <div className={`w-12 h-1 rounded
                        ${step < currentStep ? 'bg-green-500' : 'bg-muted'}
                      `} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex justify-center space-x-8 text-sm">
                <Badge variant={currentStep >= 1 ? "default" : "outline"}>Organization</Badge>
                <Badge variant={currentStep >= 2 ? "default" : "outline"}>Open Call</Badge>
                <Badge variant={currentStep >= 3 ? "default" : "outline"}>Experience</Badge>
                <Badge variant={currentStep >= 4 ? "default" : "outline"}>Review</Badge>
              </div>
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-8">
                {renderStepContent()}
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStepValid(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createHostApplication.isPending || !isStepValid(currentStep)}
                className="min-w-32"
              >
                {createHostApplication.isPending ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HostApplication;
