
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Palette } from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';
import { toast } from '@/hooks/use-toast';

interface CreatePortfolioDialogProps {
  onPortfolioCreated?: () => void;
}

const CreatePortfolioDialog = ({ onPortfolioCreated }: CreatePortfolioDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template_id: 'crestline',
    is_public: false
  });

  const { createPortfolio } = usePortfolios();

  const templates = [
    { id: 'crestline', name: 'Crestline', description: 'Clean and modern layout' },
    { id: 'artfolio', name: 'Artfolio', description: 'Gallery-focused design' },
    { id: 'rowan', name: 'Rowan', description: 'Minimalist showcase' },
    { id: 'panorama', name: 'Panorama', description: 'Wide format display' }
  ];

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

    setIsLoading(true);
    
    try {
      await createPortfolio(formData);
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        template_id: 'crestline',
        is_public: false
      });
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
      <DialogContent className="sm:max-w-[600px]">
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

          <div className="space-y-2">
            <Label>Template</Label>
            <Select 
              value={formData.template_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, template_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
