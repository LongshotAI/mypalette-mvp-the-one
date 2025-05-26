
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Building2, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
    proposedBudget: 0,
    proposedPrizeAmount: 0,
    targetSubmissions: 100,
    experienceDescription: '',
    previousExhibitions: '',
    curatorialStatement: '',
    technicalRequirements: '',
    marketingPlan: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    createHostApplication.mutate(formData, {
      onSuccess: () => {
        navigate('/dashboard');
      }
    });
  };

  const handleInputChange = (field: keyof HostApplicationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to submit a host application.
              </p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
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
            
            <h1 className="text-3xl font-bold mb-2">Apply to Host an Open Call</h1>
            <p className="text-muted-foreground">
              Submit your proposal to host an open call on MyPalette
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Organization Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Organization Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orgName">Organization Name *</Label>
                      <Input
                        id="orgName"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        placeholder="Your organization name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="orgType">Organization Type *</Label>
                      <Select onValueChange={(value) => handleInputChange('organizationType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gallery">Gallery</SelectItem>
                          <SelectItem value="museum">Museum</SelectItem>
                          <SelectItem value="nonprofit">Non-profit</SelectItem>
                          <SelectItem value="university">University</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="independent">Independent Curator</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        placeholder="https://yourorganization.com"
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
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Organization address"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Proposed Open Call Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Proposed Open Call Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Proposed Title *</Label>
                    <Input
                      id="title"
                      value={formData.proposedTitle}
                      onChange={(e) => handleInputChange('proposedTitle', e.target.value)}
                      placeholder="Title of your open call"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Proposed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.proposedDescription}
                      onChange={(e) => handleInputChange('proposedDescription', e.target.value)}
                      placeholder="Describe your open call concept, goals, and vision"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme">Proposed Theme</Label>
                      <Input
                        id="theme"
                        value={formData.proposedTheme}
                        onChange={(e) => handleInputChange('proposedTheme', e.target.value)}
                        placeholder="Main theme or concept"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Submission Deadline *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.proposedDeadline}
                        onChange={(e) => handleInputChange('proposedDeadline', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exhibitionDates">Exhibition Dates</Label>
                      <Input
                        id="exhibitionDates"
                        value={formData.proposedExhibitionDates}
                        onChange={(e) => handleInputChange('proposedExhibitionDates', e.target.value)}
                        placeholder="e.g., March 15-30, 2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue">Proposed Venue</Label>
                      <Input
                        id="venue"
                        value={formData.proposedVenue}
                        onChange={(e) => handleInputChange('proposedVenue', e.target.value)}
                        placeholder="Exhibition venue or format"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Budget and Logistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget and Logistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="budget">Proposed Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.proposedBudget}
                        onChange={(e) => handleInputChange('proposedBudget', Number(e.target.value))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prizeAmount">Prize Amount ($)</Label>
                      <Input
                        id="prizeAmount"
                        type="number"
                        value={formData.proposedPrizeAmount}
                        onChange={(e) => handleInputChange('proposedPrizeAmount', Number(e.target.value))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetSubmissions">Target Submissions</Label>
                      <Input
                        id="targetSubmissions"
                        type="number"
                        value={formData.targetSubmissions}
                        onChange={(e) => handleInputChange('targetSubmissions', Number(e.target.value))}
                        placeholder="100"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="technicalRequirements">Technical Requirements</Label>
                    <Textarea
                      id="technicalRequirements"
                      value={formData.technicalRequirements}
                      onChange={(e) => handleInputChange('technicalRequirements', e.target.value)}
                      placeholder="Describe any technical requirements for submissions"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Experience and Curatorial Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Experience and Curatorial Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="experience">Experience Description *</Label>
                    <Textarea
                      id="experience"
                      value={formData.experienceDescription}
                      onChange={(e) => handleInputChange('experienceDescription', e.target.value)}
                      placeholder="Describe your experience in organizing exhibitions and open calls"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="previousExhibitions">Previous Exhibitions</Label>
                    <Textarea
                      id="previousExhibitions"
                      value={formData.previousExhibitions}
                      onChange={(e) => handleInputChange('previousExhibitions', e.target.value)}
                      placeholder="List relevant previous exhibitions or projects"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="curatorial">Curatorial Statement *</Label>
                    <Textarea
                      id="curatorial"
                      value={formData.curatorialStatement}
                      onChange={(e) => handleInputChange('curatorialStatement', e.target.value)}
                      placeholder="Your curatorial vision and approach for this open call"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="marketing">Marketing Plan</Label>
                    <Textarea
                      id="marketing"
                      value={formData.marketingPlan}
                      onChange={(e) => handleInputChange('marketingPlan', e.target.value)}
                      placeholder="How do you plan to promote this open call?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end"
            >
              <Button 
                type="submit" 
                size="lg" 
                disabled={createHostApplication.isPending}
                className="min-w-[200px]"
              >
                <Send className="h-4 w-4 mr-2" />
                {createHostApplication.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default HostApplication;
