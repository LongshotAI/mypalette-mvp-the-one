
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Eye, Sparkles, Layout, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  preview: React.ReactNode;
  isPremium?: boolean;
}

interface PortfolioTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const PortfolioTemplateSelector = ({ selectedTemplate, onSelectTemplate }: PortfolioTemplateSelectorProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const templates: TemplateOption[] = [
    {
      id: 'glassmorphic',
      name: 'Glassmorphic',
      description: 'Modern glass-like effects with blur and transparency',
      features: ['Glass blur effects', 'Floating elements', 'Gradient backgrounds', 'Smooth animations'],
      icon: <Sparkles className="h-5 w-5" />,
      isPremium: true,
      preview: (
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
          <div className="absolute inset-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
            <div className="p-3">
              <div className="w-8 h-8 bg-white/30 rounded-full mb-2"></div>
              <div className="w-16 h-2 bg-white/40 rounded mb-1"></div>
              <div className="w-12 h-2 bg-white/20 rounded"></div>
            </div>
          </div>
          <motion.div
            className="absolute top-4 right-4 w-4 h-4 bg-white/40 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )
    },
    {
      id: 'parallax',
      name: 'Parallax',
      description: 'Dynamic scrolling effects with depth and movement',
      features: ['Parallax scrolling', 'Layer depth effects', 'Interactive elements', 'Immersive experience'],
      icon: <Layout className="h-5 w-5" />,
      isPremium: true,
      preview: (
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
          <motion.div
            className="absolute inset-0 bg-black/20"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute inset-4 bg-white/10 rounded backdrop-blur-sm">
            <div className="p-3">
              <motion.div
                className="w-8 h-8 bg-white/30 rounded mb-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-16 h-2 bg-white/40 rounded mb-1"
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div
                className="w-12 h-2 bg-white/20 rounded"
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean, elegant design focused on your artwork',
      features: ['Clean typography', 'Spacious layouts', 'Focus on content', 'Fast loading'],
      icon: <Minimize2 className="h-5 w-5" />,
      preview: (
        <div className="w-full h-32 rounded-lg border-2 border-gray-200 bg-white">
          <div className="p-4">
            <div className="w-6 h-6 bg-gray-800 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="w-20 h-2 bg-gray-800 rounded"></div>
              <div className="w-16 h-1 bg-gray-400 rounded"></div>
              <div className="w-14 h-1 bg-gray-300 rounded"></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1">
              <div className="aspect-square bg-gray-100 rounded"></div>
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="aspect-square bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Choose Your Portfolio Template</h3>
        <p className="text-muted-foreground">
          Select a template that best represents your artistic style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {template.icon}
                  {template.name}
                </CardTitle>
                {template.isPremium && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Template Preview */}
              <div className="relative">
                {template.preview}
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Features:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preview Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate(template.id);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Template
              </Button>

              {selectedTemplate === template.id && (
                <div className="flex items-center justify-center mt-2">
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <Check className="h-4 w-4" />
                    Selected
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Preview Modal would go here */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {templates.find(t => t.id === previewTemplate)?.name} Template Preview
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close
                </Button>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Full template preview coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTemplateSelector;
