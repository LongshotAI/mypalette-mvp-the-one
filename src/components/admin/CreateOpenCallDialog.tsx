
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Award, Upload, X, Image } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedStorage } from '@/hooks/useEnhancedStorage';
import { Progress } from '@/components/ui/progress';

const CreateOpenCallDialog = () => {
  const [open, setOpen] = useState(false);
  const [submissionDeadline, setSubmissionDeadline] = useState<Date>();
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
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
    status: 'live'
  });

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { uploadHostAsset, uploadProgress, isUploading } = useEnhancedStorage();

  const createOpenCall = useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating open call:', data);
      
      let coverImageUrl = '';
      let logoImageUrl = '';

      // Upload cover image if provided
      if (coverImageFile) {
        const coverResult = await uploadHostAsset.mutateAsync({
          file: coverImageFile,
          category: 'covers'
        });
        coverImageUrl = coverResult.url;
      }

      // Upload logo image if provided
      if (logoImageFile) {
        const logoResult = await uploadHostAsset.mutateAsync({
          file: logoImageFile,
          category: 'logos'
        });
        logoImageUrl = logoResult.url;
      }

      const { data: result, error } = await supabase
        .from('open_calls')
        .insert({
          ...data,
          host_user_id: user?.id,
          submission_deadline: submissionDeadline?.toISOString(),
          cover_image: coverImageUrl || null,
          logo_image: logoImageUrl || null,
          max_submissions: -1 // Unlimited submissions
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
      queryClient.invalidateQueries({ queryKey: ['admin-open-calls'] });
      queryClient.invalidateQueries({ queryKey: ['featured-open-calls'] });
      toast({
        title: "Open Call Created",
        description: "The open call has been created successfully.",
      });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create open call.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
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
      status: 'live'
    });
    setSubmissionDeadline(undefined);
    setCoverImageFile(null);
    setLogoImageFile(null);
  };

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'logo') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }

      if (type === 'cover') {
        setCoverImageFile(file);
      } else {
        setLogoImageFile(file);
      }
    }
  };

  const removeFile = (type: 'cover' | 'logo') => {
    if (type === 'cover') {
      setCoverImageFile(null);
    } else {
      setLogoImageFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Open Call
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Open Call</DialogTitle>
          <DialogDescription>
            Create a new open call for artists to submit their work.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter open call title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization *</Label>
              <Input
                id="organization"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                placeholder="Your organization name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe your open call, theme, and what you're looking for..."
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

          {/* Images Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {coverImageFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Image className="h-4 w-4" />
                        <span className="text-sm font-medium">{coverImageFile.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('cover')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <Label htmlFor="cover-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:text-primary/80">
                        Upload cover image
                      </span>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 50MB</p>
                    </Label>
                    <Input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, 'cover')}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Logo Image */}
            <div className="space-y-2">
              <Label>Organization Logo (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {logoImageFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Image className="h-4 w-4" />
                        <span className="text-sm font-medium">{logoImageFile.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('logo')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:text-primary/80">
                        Upload logo
                      </span>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 50MB</p>
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, 'logo')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading images...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Details */}
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
              <Label>Submission Deadline *</Label>
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
              <Label htmlFor="prize">Prize Information</Label>
              <Input
                id="prize"
                value={formData.prize_info}
                onChange={(e) => setFormData({ ...formData, prize_info: e.target.value })}
                placeholder="e.g., $1000 first prize, exhibition opportunity..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="winners"># of Winners/Selected Artists</Label>
              <Input
                id="winners"
                type="number"
                min="1"
                value={formData.num_winners}
                onChange={(e) => setFormData({ ...formData, num_winners: parseInt(e.target.value) || 1 })}
              />
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createOpenCall.isPending || isUploading}
            >
              {createOpenCall.isPending || isUploading ? 'Creating...' : 'Create Open Call'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOpenCallDialog;
