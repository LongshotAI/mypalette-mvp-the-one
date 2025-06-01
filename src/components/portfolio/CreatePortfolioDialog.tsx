
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { usePortfolios } from '@/hooks/usePortfolios';

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePortfolioDialog = ({ open, onOpenChange }: CreatePortfolioDialogProps) => {
  const navigate = useNavigate();
  const { createPortfolio } = usePortfolios();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template_id: 'crestline',
    is_public: false
  });
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const portfolio = await createPortfolio(formData);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        template_id: 'crestline',
        is_public: false
      });
      
      // Navigate to editor
      navigate(`/portfolio/edit/${portfolio.id}`);
    } catch (error) {
      console.error('Error creating portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Portfolio</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Portfolio Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter portfolio title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your portfolio"
              rows={3}
            />
          </div>

          <div>
            <Label>Template</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.template_id === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, template_id: template.id }))}
                >
                  <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                  {formData.template_id === template.id && (
                    <Badge className="mt-1 text-xs">Selected</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public">Make Portfolio Public</Label>
              <p className="text-sm text-muted-foreground">
                Public portfolios can be discovered by others
              </p>
            </div>
            <Switch
              id="public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Portfolio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePortfolioDialog;
