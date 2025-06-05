
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Palette, Sparkles, Layout, Minimize2 } from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';
import { usePortfolioTemplates } from '@/hooks/usePortfolioTemplates';
import { toast } from '@/hooks/use-toast';
import PortfolioTemplateSelector from './templates/PortfolioTemplateSelector';

interface CreatePortfolioDialogProps {
  onPortfolioCreated?: () => void;
}

const CreatePortfolioDialog = ({ onPortfolioCreated }: CreatePortfolioDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_public: false
  });

  const { createPortfolio } = usePortfolios();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Portfolio title is required",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTemplate) {
      toast({
        title: "Error", 
        description: "Please select a template",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await createPortfolio({
        ...formData,
        template_id: selectedTemplate
      });
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        is_public: false
      });
      setSelectedTemplate('minimal');
      onPortfolioCreated?.();
      toast({
        title: "Success",
        description: "Portfolio created successfully!"
      });
    } catch (error) {
      console.error('Error creating portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Create New Portfolio
          </DialogTitle>
          <DialogDescription>
            Create a new portfolio to showcase your artistic work
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Portfolio Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter portfolio title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your portfolio (optional)"
              rows={3}
            />
          </div>

          <PortfolioTemplateSelector
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_public">Make Public</Label>
              <div className="text-sm text-muted-foreground">
                Allow others to discover and view this portfolio
              </div>
            </div>
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creating...' : 'Create Portfolio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePortfolioDialog;
