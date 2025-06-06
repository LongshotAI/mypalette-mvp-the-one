
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, Users, Building } from 'lucide-react';
import { useHostApplications } from '@/hooks/useHostApplications';
import { toast } from '@/hooks/use-toast';

const HostApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
    marketingPlan: ''
  });

  const { createHostApplication } = useHostApplications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.organizationName || !formData.contactEmail || !formData.proposedTitle) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting host application:', formData);
      await createHostApplication.mutateAsync(formData);
      
      // Reset form
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
        marketingPlan: ''
      });
    } catch (error) {
      console.error('Failed to submit host application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Host an Open Call</h1>
        <p className="text-muted-foreground">
          Submit your application to host an open call on MyPalette
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="Your organization or gallery name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="organizationType">Organization Type *</Label>
                <Select value={formData.organizationType} onValueChange={(value) => setFormData({ ...formData, organizationType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gallery">Gallery</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@organization.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://yourorganization.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address of your organization"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Open Call Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Open Call Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="proposedTitle">Open Call Title *</Label>
              <Input
                id="proposedTitle"
                value={formData.proposedTitle}
                onChange={(e) => setFormData({ ...formData, proposedTitle: e.target.value })}
                placeholder="Title of your open call"
                required
              />
            </div>

            <div>
              <Label htmlFor="proposedDescription">Description *</Label>
              <Textarea
                id="proposedDescription"
                value={formData.proposedDescription}
                onChange={(e) => setFormData({ ...formData, proposedDescription: e.target.value })}
                placeholder="Detailed description of your open call"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proposedTheme">Theme/Category</Label>
                <Input
                  id="proposedTheme"
                  value={formData.proposedTheme}
                  onChange={(e) => setFormData({ ...formData, proposedTheme: e.target.value })}
                  placeholder="e.g., Contemporary Art, Digital Media"
                />
              </div>
              <div>
                <Label htmlFor="proposedDeadline">Submission Deadline *</Label>
                <Input
                  id="proposedDeadline"
                  type="datetime-local"
                  value={formData.proposedDeadline}
                  onChange={(e) => setFormData({ ...formData, proposedDeadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proposedVenue">Exhibition Venue</Label>
                <Input
                  id="proposedVenue"
                  value={formData.proposedVenue}
                  onChange={(e) => setFormData({ ...formData, proposedVenue: e.target.value })}
                  placeholder="Where will the exhibition be held?"
                />
              </div>
              <div>
                <Label htmlFor="proposedExhibitionDates">Exhibition Dates</Label>
                <Input
                  id="proposedExhibitionDates"
                  value={formData.proposedExhibitionDates}
                  onChange={(e) => setFormData({ ...formData, proposedExhibitionDates: e.target.value })}
                  placeholder="e.g., March 15 - April 30, 2024"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget and Prizes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget & Prizes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="proposedBudget">Total Budget ($)</Label>
                <Input
                  id="proposedBudget"
                  type="number"
                  value={formData.proposedBudget}
                  onChange={(e) => setFormData({ ...formData, proposedBudget: parseInt(e.target.value) || 0 })}
                  placeholder="10000"
                />
              </div>
              <div>
                <Label htmlFor="proposedPrizeAmount">Prize Amount ($)</Label>
                <Input
                  id="proposedPrizeAmount"
                  type="number"
                  value={formData.proposedPrizeAmount}
                  onChange={(e) => setFormData({ ...formData, proposedPrizeAmount: parseInt(e.target.value) || 0 })}
                  placeholder="5000"
                />
              </div>
              <div>
                <Label htmlFor="targetSubmissions">Expected Submissions</Label>
                <Input
                  id="targetSubmissions"
                  type="number"
                  value={formData.targetSubmissions}
                  onChange={(e) => setFormData({ ...formData, targetSubmissions: parseInt(e.target.value) || 100 })}
                  placeholder="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience & Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Experience & Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="experienceDescription">Organization Experience *</Label>
              <Textarea
                id="experienceDescription"
                value={formData.experienceDescription}
                onChange={(e) => setFormData({ ...formData, experienceDescription: e.target.value })}
                placeholder="Describe your organization's experience with exhibitions and open calls"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="previousExhibitions">Previous Exhibitions</Label>
              <Textarea
                id="previousExhibitions"
                value={formData.previousExhibitions}
                onChange={(e) => setFormData({ ...formData, previousExhibitions: e.target.value })}
                placeholder="List notable previous exhibitions you've organized"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="curatorialStatement">Curatorial Statement *</Label>
              <Textarea
                id="curatorialStatement"
                value={formData.curatorialStatement}
                onChange={(e) => setFormData({ ...formData, curatorialStatement: e.target.value })}
                placeholder="Describe your curatorial vision and approach for this open call"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="technicalRequirements">Technical Requirements</Label>
              <Textarea
                id="technicalRequirements"
                value={formData.technicalRequirements}
                onChange={(e) => setFormData({ ...formData, technicalRequirements: e.target.value })}
                placeholder="Any specific technical requirements for submissions"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="marketingPlan">Marketing & Promotion Plan</Label>
              <Textarea
                id="marketingPlan"
                value={formData.marketingPlan}
                onChange={(e) => setFormData({ ...formData, marketingPlan: e.target.value })}
                placeholder="How will you promote the open call and exhibition?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? 'Submitting Application...' : 'Submit Host Application'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HostApplicationForm;
