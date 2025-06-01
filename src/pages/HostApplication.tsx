
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Send, Building, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHostApplications, HostApplicationData } from '@/hooks/useHostApplications';

const HostApplication = () => {
  const navigate = useNavigate();
  const { createHostApplication } = useHostApplications();
  
  const [formData, setFormData] = useState<HostApplicationData>({
    organizationName: '',
    organizationType: 'gallery',
    websiteUrl: '',
    contactEmail: '',
    phone: '',
    address: '',
    proposedTitle: '',
    proposedDescription: '',
    proposedTheme: '',
    proposedDeadline: '',
    proposedExhibitionDates: '',
    proposedVenue: '',
    proposedBudget: 0,
    proposedPrizeAmount: 0,
    targetSubmissions: 50,
    experienceDescription: '',
    previousExhibitions: '',
    curatorialStatement: '',
    technicalRequirements: '',
    marketingPlan: '',
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const updateFormData = (field: keyof HostApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createHostApplication.mutateAsync(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const isStep1Valid = formData.organizationName && formData.contactEmail && formData.proposedTitle && formData.proposedDescription;
  const isStep2Valid = formData.experienceDescription && formData.curatorialStatement;
  const isStep3Valid = formData.proposedDeadline && agreedToTerms;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mb-8"
          >
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">Host Application</h1>
              <p className="text-muted-foreground">
                Apply to host an open call on MyPalette
              </p>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStep === 1 && (
                    <>
                      <Building className="h-5 w-5" />
                      Organization & Open Call Details
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <Send className="h-5 w-5" />
                      Experience & Vision
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <Calendar className="h-5 w-5" />
                      Timeline & Confirmation
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Organization & Open Call Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="orgName">Organization Name *</Label>
                        <Input
                          id="orgName"
                          value={formData.organizationName}
                          onChange={(e) => updateFormData('organizationName', e.target.value)}
                          placeholder="Your organization name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Contact Email *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => updateFormData('contactEmail', e.target.value)}
                          placeholder="contact@organization.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">Website URL</Label>
                        <Input
                          id="website"
                          value={formData.websiteUrl}
                          onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                          placeholder="https://www.organization.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Organization Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        placeholder="Full address of your organization"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="proposedTitle">Proposed Open Call Title *</Label>
                      <Input
                        id="proposedTitle"
                        value={formData.proposedTitle}
                        onChange={(e) => updateFormData('proposedTitle', e.target.value)}
                        placeholder="Name of your open call"
                      />
                    </div>

                    <div>
                      <Label htmlFor="proposedDescription">Open Call Description *</Label>
                      <Textarea
                        id="proposedDescription"
                        value={formData.proposedDescription}
                        onChange={(e) => updateFormData('proposedDescription', e.target.value)}
                        placeholder="Describe the open call, its purpose, and what you're looking for"
                        rows={4}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="theme">Theme (Optional)</Label>
                        <Input
                          id="theme"
                          value={formData.proposedTheme}
                          onChange={(e) => updateFormData('proposedTheme', e.target.value)}
                          placeholder="e.g., 'Digital Futures', 'Nature & Technology'"
                        />
                      </div>
                      <div>
                        <Label htmlFor="venue">Exhibition Venue</Label>
                        <Input
                          id="venue"
                          value={formData.proposedVenue}
                          onChange={(e) => updateFormData('proposedVenue', e.target.value)}
                          placeholder="Where will the exhibition be held?"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Experience & Vision */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="experience">Experience Description *</Label>
                      <Textarea
                        id="experience"
                        value={formData.experienceDescription}
                        onChange={(e) => updateFormData('experienceDescription', e.target.value)}
                        placeholder="Describe your organization's experience in organizing exhibitions, open calls, or art events"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="previousExhibitions">Previous Exhibitions</Label>
                      <Textarea
                        id="previousExhibitions"
                        value={formData.previousExhibitions}
                        onChange={(e) => updateFormData('previousExhibitions', e.target.value)}
                        placeholder="List notable previous exhibitions or events you've organized"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="curatorial">Curatorial Statement *</Label>
                      <Textarea
                        id="curatorial"
                        value={formData.curatorialStatement}
                        onChange={(e) => updateFormData('curatorialStatement', e.target.value)}
                        placeholder="Explain your curatorial vision and approach for this open call"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="technical">Technical Requirements</Label>
                      <Textarea
                        id="technical"
                        value={formData.technicalRequirements}
                        onChange={(e) => updateFormData('technicalRequirements', e.target.value)}
                        placeholder="Describe any specific technical requirements for submissions"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="marketing">Marketing Plan</Label>
                      <Textarea
                        id="marketing"
                        value={formData.marketingPlan}
                        onChange={(e) => updateFormData('marketingPlan', e.target.value)}
                        placeholder="How do you plan to promote the open call and exhibition?"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Timeline & Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deadline">Submission Deadline *</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={formData.proposedDeadline}
                          onChange={(e) => updateFormData('proposedDeadline', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="exhibitionDates">Exhibition Dates</Label>
                        <Input
                          id="exhibitionDates"
                          value={formData.proposedExhibitionDates}
                          onChange={(e) => updateFormData('proposedExhibitionDates', e.target.value)}
                          placeholder="e.g., March 15-30, 2024"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="budget">Proposed Budget</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="budget"
                            type="number"
                            value={formData.proposedBudget}
                            onChange={(e) => updateFormData('proposedBudget', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="prize">Prize Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="prize"
                            type="number"
                            value={formData.proposedPrizeAmount}
                            onChange={(e) => updateFormData('proposedPrizeAmount', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="target">Target Submissions</Label>
                        <Input
                          id="target"
                          type="number"
                          value={formData.targetSubmissions}
                          onChange={(e) => updateFormData('targetSubmissions', parseInt(e.target.value) || 50)}
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-4">Application Summary</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><span className="font-medium">Organization:</span> {formData.organizationName}</p>
                          <p><span className="font-medium">Open Call:</span> {formData.proposedTitle}</p>
                          <p><span className="font-medium">Deadline:</span> {formData.proposedDeadline}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Budget:</span> ${formData.proposedBudget}</p>
                          <p><span className="font-medium">Prize:</span> ${formData.proposedPrizeAmount}</p>
                          <p><span className="font-medium">Target Submissions:</span> {formData.targetSubmissions}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={setAgreedToTerms}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the terms and conditions and confirm that all information provided is accurate
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={
                        (currentStep === 1 && !isStep1Valid) ||
                        (currentStep === 2 && !isStep2Valid)
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStep3Valid || createHostApplication.isPending}
                    >
                      {createHostApplication.isPending ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HostApplication;
