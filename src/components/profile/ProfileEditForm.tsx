import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileData {
  first_name: string;
  last_name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
  artistic_medium: string;
  artistic_style: string;
  years_active: number | null;
  artist_statement: string;
  education: string;
  exhibitions: string;
  awards: string;
  commission_info: string;
  pricing_info: string;
  available_for_commission: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface ProfileEditFormProps {
  initialData?: Partial<ProfileData>;
  socialLinks?: SocialLink[];
  onSuccess?: () => void;
}

const ProfileEditForm = ({ initialData, socialLinks = [], onSuccess }: ProfileEditFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ProfileData>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    username: initialData?.username || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    website: initialData?.website || '',
    phone: initialData?.phone || '',
    artistic_medium: initialData?.artistic_medium || '',
    artistic_style: initialData?.artistic_style || '',
    years_active: initialData?.years_active || null,
    artist_statement: initialData?.artist_statement || '',
    education: initialData?.education || '',
    exhibitions: initialData?.exhibitions || '',
    awards: initialData?.awards || '',
    commission_info: initialData?.commission_info || '',
    pricing_info: initialData?.pricing_info || '',
    available_for_commission: initialData?.available_for_commission || false,
  });

  const [currentSocialLinks, setSocialLinks] = useState<SocialLink[]>(socialLinks);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileData) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Updating profile for user:', user.id);
      console.log('Profile data:', data);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Update social links
      if (currentSocialLinks.length > 0) {
        // Delete existing links
        await supabase
          .from('social_links')
          .delete()
          .eq('user_id', user.id);

        // Insert new links
        const linksToInsert = currentSocialLinks.map(link => ({
          user_id: user.id,
          platform: link.platform,
          url: link.url
        }));

        const { error: linksError } = await supabase
          .from('social_links')
          .insert(linksToInsert);

        if (linksError) {
          console.error('Error updating social links:', linksError);
          throw linksError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setSocialLinks([...currentSocialLinks, newSocialLink]);
      setNewSocialLink({ platform: '', url: '' });
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(currentSocialLinks.filter((_, i) => i !== index));
  };

  const artisticMediums = [
    'Painting', 'Photography', 'Sculpture', 'Digital Art', 'Mixed Media',
    'Installation', 'Performance', 'Video Art', 'Printmaking', 'Drawing',
    'Ceramics', 'Textile Art', 'Street Art', 'Abstract', 'Conceptual'
  ];

  const artisticStyles = [
    'Contemporary', 'Abstract', 'Realism', 'Impressionism', 'Minimalism',
    'Pop Art', 'Surrealism', 'Expressionism', 'Conceptual', 'Street Art',
    'Traditional', 'Modern', 'Experimental', 'Fine Art', 'Commercial'
  ];

  const socialPlatforms = [
    'Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok',
    'YouTube', 'Behance', 'Dribbble', 'DeviantArt', 'ArtStation'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Your first name"
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Your last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Your unique username"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Your phone number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Artistic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Artistic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="artistic_medium">Primary Medium</Label>
              <Select
                value={formData.artistic_medium}
                onValueChange={(value) => setFormData(prev => ({ ...prev, artistic_medium: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary medium" />
                </SelectTrigger>
                <SelectContent>
                  {artisticMediums.map((medium) => (
                    <SelectItem key={medium} value={medium.toLowerCase()}>
                      {medium}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="artistic_style">Artistic Style</Label>
              <Select
                value={formData.artistic_style}
                onValueChange={(value) => setFormData(prev => ({ ...prev, artistic_style: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your artistic style" />
                </SelectTrigger>
                <SelectContent>
                  {artisticStyles.map((style) => (
                    <SelectItem key={style} value={style.toLowerCase()}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="years_active">Years Active</Label>
            <Input
              id="years_active"
              type="number"
              value={formData.years_active || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                years_active: e.target.value ? parseInt(e.target.value) : null 
              }))}
              placeholder="How many years have you been creating art?"
            />
          </div>

          <div>
            <Label htmlFor="artist_statement">Artist Statement</Label>
            <Textarea
              id="artist_statement"
              value={formData.artist_statement}
              onChange={(e) => setFormData(prev => ({ ...prev, artist_statement: e.target.value }))}
              placeholder="Describe your artistic vision and practice..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              value={formData.education}
              onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
              placeholder="Your educational background..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="exhibitions">Exhibitions</Label>
            <Textarea
              id="exhibitions"
              value={formData.exhibitions}
              onChange={(e) => setFormData(prev => ({ ...prev, exhibitions: e.target.value }))}
              placeholder="Notable exhibitions and shows..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="awards">Awards & Recognition</Label>
            <Textarea
              id="awards"
              value={formData.awards}
              onChange={(e) => setFormData(prev => ({ ...prev, awards: e.target.value }))}
              placeholder="Awards, grants, and recognition..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Commission Information */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="available_for_commission"
              checked={formData.available_for_commission}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available_for_commission: checked }))}
            />
            <Label htmlFor="available_for_commission">Available for commissions</Label>
          </div>

          <div>
            <Label htmlFor="commission_info">Commission Information</Label>
            <Textarea
              id="commission_info"
              value={formData.commission_info}
              onChange={(e) => setFormData(prev => ({ ...prev, commission_info: e.target.value }))}
              placeholder="Information about your commission process..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="pricing_info">Pricing Information</Label>
            <Textarea
              id="pricing_info"
              value={formData.pricing_info}
              onChange={(e) => setFormData(prev => ({ ...prev, pricing_info: e.target.value }))}
              placeholder="Your pricing structure and rates..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Links */}
          {currentSocialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input value={link.platform} disabled />
                <Input value={link.url} disabled />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeSocialLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Add New Link */}
          <div className="flex items-center gap-2">
            <Select
              value={newSocialLink.platform}
              onValueChange={(value) => setNewSocialLink(prev => ({ ...prev, platform: value }))}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {socialPlatforms.map((platform) => (
                  <SelectItem key={platform} value={platform.toLowerCase()}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="flex-1"
              value={newSocialLink.url}
              onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Profile URL"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSocialLink}
              disabled={!newSocialLink.platform || !newSocialLink.url}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={updateProfile.isPending}
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
