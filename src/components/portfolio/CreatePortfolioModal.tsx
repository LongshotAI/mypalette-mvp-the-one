
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { usePortfolios } from '@/hooks/usePortfolios';
import { Plus } from 'lucide-react';

interface CreatePortfolioModalProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const CreatePortfolioModal = ({ onSuccess, trigger }: CreatePortfolioModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template_id: 'crestline',
    is_public: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createPortfolio } = usePortfolios();

  const templates = [
    { id: 'crestline', name: 'Crestline', description: 'Clean and professional' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' },
    { id: 'gallery', name: 'Gallery', description: 'Image-focused layout' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    try {
      setIsLoading(true);
      console.log('Creating portfolio via modal with data:', formData);
      
      await createPortfolio({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        template_id: formData.template_id,
        is_public: formData.is_public,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        template_id: 'crestline',
        is_public: false,
      });
      
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create portfolio:', error);
      // Error handling is done in the createPortfolio function via toast
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Create Portfolio
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Portfolio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Portfolio Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter portfolio title"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your portfolio"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="template">Template</Label>
            <Select
              value={formData.template_id}
              onValueChange={(value) => setFormData({ ...formData, template_id: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
              disabled={isLoading}
            />
            <Label htmlFor="public">Make portfolio public</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.title.trim()} 
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Portfolio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePortfolioModal;
