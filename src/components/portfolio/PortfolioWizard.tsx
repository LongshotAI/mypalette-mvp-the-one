
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Palette, Sparkles, Eye, Check } from 'lucide-react';
import { usePortfolioTemplates, PortfolioTemplate } from '@/hooks/usePortfolioTemplates';
import { usePortfolios } from '@/hooks/usePortfolios';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { toast } from '@/hooks/use-toast';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

const WIZARD_STEPS: WizardStep[] = [
  { id: 'basic', title: 'Basic Info', description: 'Tell us about your portfolio' },
  { id: 'template', title: 'Choose Template', description: 'Select your perfect design' },
  { id: 'customize', title: 'Customize', description: 'Make it uniquely yours' },
  { id: 'review', title: 'Review', description: 'Final touches before publishing' },
];

interface PortfolioWizardProps {
  onComplete: (portfolioId: string) => void;
  onCancel: () => void;
}

const PortfolioWizard = ({ onComplete, onCancel }: PortfolioWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    title: '',
    description: '',
    templateId: '',
    customSettings: {},
    isPublic: true,
  });

  const { data: templates = [], isLoading: templatesLoading } = usePortfolioTemplates();
  const { createPortfolio } = usePortfolios();
  const { trackEvent } = useUserAnalytics();

  const selectedTemplate = templates.find(t => t.id === portfolioData.templateId);

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      trackEvent.mutate({
        eventType: 'portfolio_wizard_step',
        eventData: { step: WIZARD_STEPS[currentStep + 1].id }
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!portfolioData.title || !portfolioData.templateId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const portfolio = await createPortfolio({
        title: portfolioData.title,
        description: portfolioData.description,
        template_id: portfolioData.templateId,
        is_public: portfolioData.isPublic,
      });

      trackEvent.mutate({
        eventType: 'portfolio_created',
        eventData: { templateId: portfolioData.templateId, wizardUsed: true }
      });

      toast({
        title: "Portfolio Created!",
        description: "Your stunning portfolio is ready to showcase your work.",
      });

      onComplete(portfolio.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getTemplatePreview = (template: PortfolioTemplate) => {
    const { theme, colors, effects } = template.template_data;
    
    const baseStyle: React.CSSProperties = {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    };

    if (effects?.includes('blur')) {
      Object.assign(baseStyle, {
        filter: 'blur(0.5px)',
        background: `linear-gradient(135deg, ${colors.primary}80, ${colors.secondary}80)`,
      });
    }

    return (
      <div 
        className="w-full h-32 rounded-lg relative overflow-hidden"
        style={baseStyle}
      >
        <div className="absolute inset-0 p-4 text-white">
          <div className="w-8 h-8 bg-white/20 rounded mb-2"></div>
          <div className="w-16 h-2 bg-white/30 rounded mb-1"></div>
          <div className="w-12 h-2 bg-white/20 rounded"></div>
        </div>
        {effects?.includes('parallax') && (
          <motion.div
            className="absolute top-2 right-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-white/60" />
          </motion.div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (WIZARD_STEPS[currentStep].id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Portfolio Title *</Label>
              <Input
                id="title"
                placeholder="My Creative Portfolio"
                value={portfolioData.title}
                onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell the world about your artistic vision..."
                value={portfolioData.description}
                onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        );

      case 'template':
        return (
          <div className="space-y-6">
            {templatesLoading ? (
              <div className="text-center py-8">Loading templates...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      portfolioData.templateId === template.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setPortfolioData({ ...portfolioData, templateId: template.id })}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.is_premium && (
                          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getTemplatePreview(template)}
                      {portfolioData.templateId === template.id && (
                        <div className="flex items-center mt-3 text-primary">
                          <Check className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'customize':
        return (
          <div className="space-y-6">
            {selectedTemplate && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customizing: {selectedTemplate.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: selectedTemplate.template_data.colors.primary }}
                      />
                      <Input
                        type="color"
                        value={selectedTemplate.template_data.colors.primary}
                        onChange={(e) => {
                          const newSettings = {
                            ...portfolioData.customSettings,
                            colors: {
                              ...selectedTemplate.template_data.colors,
                              primary: e.target.value,
                            },
                          };
                          setPortfolioData({ ...portfolioData, customSettings: newSettings });
                        }}
                        className="w-16 h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: selectedTemplate.template_data.colors.secondary }}
                      />
                      <Input
                        type="color"
                        value={selectedTemplate.template_data.colors.secondary}
                        onChange={(e) => {
                          const newSettings = {
                            ...portfolioData.customSettings,
                            colors: {
                              ...selectedTemplate.template_data.colors,
                              secondary: e.target.value,
                            },
                          };
                          setPortfolioData({ ...portfolioData, customSettings: newSettings });
                        }}
                        className="w-16 h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Portfolio Summary</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="font-medium">Title:</dt>
                  <dd className="text-muted-foreground">{portfolioData.title}</dd>
                </div>
                {portfolioData.description && (
                  <div>
                    <dt className="font-medium">Description:</dt>
                    <dd className="text-muted-foreground">{portfolioData.description}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium">Template:</dt>
                  <dd className="text-muted-foreground">{selectedTemplate?.name}</dd>
                </div>
                <div>
                  <dt className="font-medium">Visibility:</dt>
                  <dd className="text-muted-foreground">
                    {portfolioData.isPublic ? 'Public' : 'Private'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold flex items-center">
            <Palette className="h-8 w-8 mr-3 text-primary" />
            Portfolio Wizard
          </h1>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-8">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div className="ml-2 mr-4">
                <div className={`text-sm font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{WIZARD_STEPS[currentStep].title}</CardTitle>
          <CardDescription>{WIZARD_STEPS[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === WIZARD_STEPS.length - 1 ? (
          <Button
            onClick={handleComplete}
            disabled={isCreating}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            {isCreating ? 'Creating...' : 'Create Portfolio'}
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && !portfolioData.title) ||
              (currentStep === 1 && !portfolioData.templateId)
            }
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PortfolioWizard;
