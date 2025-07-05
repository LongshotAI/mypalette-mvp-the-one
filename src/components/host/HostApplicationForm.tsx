
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Building, Mail, Phone, MapPin } from 'lucide-react';
import { useHostApplications, HostApplicationData } from '@/hooks/useHostApplications';
import { toast } from '@/hooks/use-toast';

const HostApplicationForm = () => {
  const { createHostApplication } = useHostApplications();
  const [formData, setFormData] = useState<HostApplicationData>({
    organizationName: '',
    organizationType: '',
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
    targetSubmissions: 100,
    experienceDescription: '',
    previousExhibitions: '',
    curatorialStatement: '',
    technicalRequirements: '',
    marketingPlan: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.organizationName || !formData.organizationType || !formData.contactEmail || 
        !formData.proposedTitle || !formData.proposedDescription || !formData.proposedDeadline ||
        !formData.experienceDescription || !formData.curatorialStatement) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createHostApplication.mutateAsync(formData);
      // Reset form on success
      setFormData({
        organizationName: '',
        organizationType: '',
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
        targetSubmissions: 100,
        experienceDescription: '',
        previousExhibitions: '',
        curatorialStatement: '',
        technicalRequirements: '',
        marketingPlan: '',
      });
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast({
        title: "Application Submission Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof HostApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building className="h-6 w-6" />
            Want to Partner with Us?
          </CardTitle>
          <p className="text-muted-foreground">
            Host your own open call on MyPalette! Apply to become a partner and showcase your vision to our vibrant artist community. All applications are reviewed by our team.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Organization Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => updateFormData('organizationName', e.target.value)}
                    required
                    placeholder="Your gallery, institution, or organization name"
                  />
                </div>
                <div>
                  <Label htmlFor="organizationType">Organization Type *</Label>
                  <Select onValueChange={(value) => updateFormData('organizationType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="museum">Museum</SelectItem>
                      <SelectItem value="institution">Educational Institution</SelectItem>
                      <SelectItem value="collective">Artist Collective</SelectItem>
                      <SelectItem value="festival">Festival/Event</SelectItem>
                      <SelectItem value="nonprofit">Non-profit</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                  placeholder="https://yourorganization.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="contactEmail"
                      type="email"
                      className="pl-10"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData('contactEmail', e.target.value)}
                      required
                      placeholder="contact@organization.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="123 Art Street, Creative City, State 12345"
                  />
                </div>
              </div>
            </div>

            {/* Proposed Open Call Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Proposed Open Call Details</h3>
              
              <div>
                <Label htmlFor="proposedTitle">Open Call Title *</Label>
                <Input
                  id="proposedTitle"
                  value={formData.proposedTitle}
                  onChange={(e) => updateFormData('proposedTitle', e.target.value)}
                  required
                  placeholder="The title of your open call"
                />
              </div>

              <div>
                <Label htmlFor="proposedDescription">Description *</Label>
                <Textarea
                  id="proposedDescription"
                  value={formData.proposedDescription}
                  onChange={(e) => updateFormData('proposedDescription', e.target.value)}
                  required
                  rows={4}
                  placeholder="Detailed description of your open call, including goals and vision"
                />
              </div>

              <div>
                <Label htmlFor="proposedTheme">Theme/Focus</Label>
                <Input
                  id="proposedTheme"
                  value={formData.proposedTheme}
                  onChange={(e) => updateFormData('proposedTheme', e.target.value)}
                  placeholder="Specific theme or artistic focus"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proposedDeadline">Submission Deadline *</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="proposedDeadline"
                      type="datetime-local"
                      className="pl-10"
                      value={formData.proposedDeadline}
                      onChange={(e) => updateFormData('proposedDeadline', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="proposedExhibitionDates">Exhibition Dates</Label>
                  <Input
                    id="proposedExhibitionDates"
                    value={formData.proposedExhibitionDates}
                    onChange={(e) => updateFormData('proposedExhibitionDates', e.target.value)}
                    placeholder="e.g., March 15 - April 30, 2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="proposedVenue">Exhibition Venue</Label>
                <Input
                  id="proposedVenue"
                  value={formData.proposedVenue}
                  onChange={(e) => updateFormData('proposedVenue', e.target.value)}
                  placeholder="Where will the exhibition be held?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="proposedBudget">Total Budget ($)</Label>
                  <Input
                    id="proposedBudget"
                    type="number"
                    min="0"
                    value={formData.proposedBudget}
                    onChange={(e) => updateFormData('proposedBudget', Number(e.target.value))}
                    placeholder="10000"
                  />
                </div>
                <div>
                  <Label htmlFor="proposedPrizeAmount">Prize Amount ($)</Label>
                  <Input
                    id="proposedPrizeAmount"
                    type="number"
                    min="0"
                    value={formData.proposedPrizeAmount}
                    onChange={(e) => updateFormData('proposedPrizeAmount', Number(e.target.value))}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="targetSubmissions">Target Submissions</Label>
                  <Input
                    id="targetSubmissions"
                    type="number"
                    min="1"
                    value={formData.targetSubmissions}
                    onChange={(e) => updateFormData('targetSubmissions', Number(e.target.value))}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Experience & Qualifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Experience & Qualifications</h3>
              
              <div>
                <Label htmlFor="experienceDescription">Experience Description *</Label>
                <Textarea
                  id="experienceDescription"
                  value={formData.experienceDescription}
                  onChange={(e) => updateFormData('experienceDescription', e.target.value)}
                  required
                  rows={3}
                  placeholder="Describe your experience in organizing exhibitions, open calls, or art events"
                />
              </div>

              <div>
                <Label htmlFor="previousExhibitions">Previous Exhibitions/Events</Label>
                <Textarea
                  id="previousExhibitions"
                  value={formData.previousExhibitions}
                  onChange={(e) => updateFormData('previousExhibitions', e.target.value)}
                  rows={3}
                  placeholder="List previous exhibitions or events you have organized"
                />
              </div>

              <div>
                <Label htmlFor="curatorialStatement">Curatorial Statement *</Label>
                <Textarea
                  id="curatorialStatement"
                  value={formData.curatorialStatement}
                  onChange={(e) => updateFormData('curatorialStatement', e.target.value)}
                  required
                  rows={4}
                  placeholder="Explain your curatorial vision and approach for this open call"
                />
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="technicalRequirements">Technical Requirements</Label>
                <Textarea
                  id="technicalRequirements"
                  value={formData.technicalRequirements}
                  onChange={(e) => updateFormData('technicalRequirements', e.target.value)}
                  rows={3}
                  placeholder="Any technical requirements for submissions (file formats, sizes, etc.)"
                />
              </div>

              <div>
                <Label htmlFor="marketingPlan">Marketing Plan</Label>
                <Textarea
                  id="marketingPlan"
                  value={formData.marketingPlan}
                  onChange={(e) => updateFormData('marketingPlan', e.target.value)}
                  rows={3}
                  placeholder="How do you plan to promote this open call and exhibition?"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostApplicationForm;
