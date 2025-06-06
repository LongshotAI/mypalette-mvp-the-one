
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Palette } from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';
import { toast } from '@/hooks/use-toast';

interface CreatePortfolioDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: (portfolioId: string) => void;
  onPortfolioCreated?: () => void; // Add this prop to fix the error
}

const CreatePortfolioDialog = ({ trigger, onSuccess, onPortfolioCreated }: CreatePortfolioDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template_id: 'minimal',
    is_public: false,
  });

  const { createPortfolio } = usePortfolios();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a portfolio title.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      console.log('Creating portfolio with data:', formData);
      const portfolio = await createPortfolio(formData);
      
      toast({
        title: "Success",
        description: "Portfolio created successfully!",
      });
      
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        template_id: 'minimal',
        is_public: false,
      });
      
      // Call both callback functions if they exist
      if (onSuccess) {
        onSuccess(portfolio.id);
      }
      if (onPortfolioCreated) {
        onPortfolioCreated();
      }
    } catch (error) {
      console.error('Failed to create portfolio:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create portfolio",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const defaultTrigger = (
    <Button variant="default" className="gap-2">
      <Plus className="h-4 w-4" />
      Create Portfolio
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Create New Portfolio
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Portfolio Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Creative Portfolio"
              maxLength={100}
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell visitors about your artistic vision..."
              rows={3}
              maxLength={500}
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <select
              id="template"
              value={formData.template_id}
              onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
              className="w-full p-2 border rounded-md"
              disabled={isCreating}
            >
              <option value="minimal">Minimal - Clean and elegant</option>
              <option value="glassmorphic">Glassmorphic - Modern glass effects</option>
              <option value="parallax">Parallax - Dynamic scrolling</option>
              <option value="gallery">Gallery - Image focused</option>
              <option value="modern">Modern - Contemporary design</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="is_public">Make Public</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to discover your portfolio
              </p>
            </div>
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
              disabled={isCreating}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || !formData.title.trim()}
            >
              {isCreating ? 'Creating...' : 'Create Portfolio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePortfolioDialog;
