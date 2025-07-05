
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Award, Upload, Image, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CreateOpenCallDialog = () => {
  const [open, setOpen] = useState(false);
  const [submissionDeadline, setSubmissionDeadline] = useState<Date>();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization_name: '',
    organization_website: '',
    submission_fee: 0,
    num_winners: 1,
    prize_info: '',
    about_host: '',
    aifilm3_partner: false,
    status: 'live',
    logo_image: '',
    cover_image: ''
  });

  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Image upload handlers
  const handleImageUpload = async (file: File, type: 'logo' | 'cover') => {
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    const setUploading = type === 'logo' ? setIsUploadingLogo : setIsUploadingCover;
    const bucket = 'host_assets';
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        [type === 'logo' ? 'logo_image' : 'cover_image']: publicUrl
      }));

      toast({
        title: "Upload Successful",
        description: `${type === 'logo' ? 'Logo' : 'Cover'} image uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (type: 'logo' | 'cover') => {
    setFormData(prev => ({
      ...prev,
      [type === 'logo' ? 'logo_image' : 'cover_image']: ''
    }));
  };

  const createOpenCall = useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating open call:', data);
      
      const { data: result, error } = await supabase
        .from('open_calls')
        .insert({
          ...data,
          host_user_id: user?.id,
          submission_deadline: submissionDeadline?.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating open call:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-calls'] });
      toast({
        title: "Open Call Created",
        description: "The open call has been created successfully.",
      });
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        organization_name: '',
        organization_website: '',
        submission_fee: 0,
        num_winners: 1,
        prize_info: '',
        about_host: '',
        aifilm3_partner: false,
        status: 'live',
        logo_image: '',
        cover_image: ''
      });
      setSubmissionDeadline(undefined);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create open call.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionDeadline) {
      toast({
        title: "Error",
        description: "Please select a submission deadline.",
        variant: "destructive",
      });
      return;
    }
    createOpenCall.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Open Call
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Open Call</DialogTitle>
          <DialogDescription>
            Create a new open call for artists to submit their work.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_host">About the Host</Label>
            <Textarea
              id="about_host"
              value={formData.about_host}
              onChange={(e) => setFormData({ ...formData, about_host: e.target.value })}
              rows={3}
              placeholder="Tell artists about your organization and what makes this opportunity special..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Organization Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.organization_website}
                onChange={(e) => setFormData({ ...formData, organization_website: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Submission Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {submissionDeadline ? format(submissionDeadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={submissionDeadline}
                    onSelect={setSubmissionDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prize">Prize Information (Optional)</Label>
              <Input
                id="prize"
                value={formData.prize_info}
                onChange={(e) => setFormData({ ...formData, prize_info: e.target.value })}
                placeholder="e.g., $1000 first prize, exhibition opportunity..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="winners"># of Artists Selected</Label>
              <Input
                id="winners"
                type="number"
                min="1"
                max="100"
                value={formData.num_winners}
                onChange={(e) => setFormData({ ...formData, num_winners: parseInt(e.target.value) || 1 })}
                placeholder="3"
              />
              <p className="text-xs text-muted-foreground">
                How many artists will you select as winners?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fee">Submission Fee ($)</Label>
              <Input
                id="fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.submission_fee}
                onChange={(e) => setFormData({ ...formData, submission_fee: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="aifilm3_partner"
              checked={formData.aifilm3_partner}
              onCheckedChange={(checked) => setFormData({ ...formData, aifilm3_partner: !!checked })}
            />
            <Label htmlFor="aifilm3_partner" className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              AIFilm3 Partner (Special badge for festival-related calls)
            </Label>
          </div>

          {/* Logo and Cover Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Organization Logo (Optional)</Label>
              <div className="mt-2">
                {formData.logo_image ? (
                  <div className="relative">
                    <img 
                      src={formData.logo_image} 
                      alt="Organization logo" 
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary cursor-pointer transition-colors"
                    onClick={() => document.getElementById('admin-logo-upload')?.click()}
                  >
                    <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Click to upload
                    </p>
                  </div>
                )}
                <input
                  id="admin-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'logo');
                  }}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <Label>Cover Image (Optional)</Label>
              <div className="mt-2">
                {formData.cover_image ? (
                  <div className="relative">
                    <img 
                      src={formData.cover_image} 
                      alt="Cover image" 
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => removeImage('cover')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary cursor-pointer transition-colors"
                    onClick={() => document.getElementById('admin-cover-upload')?.click()}
                  >
                    <Image className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Click to upload
                    </p>
                  </div>
                )}
                <input
                  id="admin-cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'cover');
                  }}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createOpenCall.isPending}>
              {createOpenCall.isPending ? 'Creating...' : 'Create Open Call'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOpenCallDialog;
