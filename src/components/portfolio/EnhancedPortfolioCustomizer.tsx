
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Layout,
  Type,
  Image,
  Settings,
  Save,
  Eye,
  Undo,
  Redo
} from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';
import { toast } from '@/hooks/use-toast';

interface CustomizationSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  layout: {
    template: string;
    gridColumns: number;
    spacing: number;
    borderRadius: number;
    showHeader: boolean;
    showBio: boolean;
    showSocialLinks: boolean;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: number;
    bodySize: number;
    lineHeight: number;
  };
  images: {
    aspectRatio: string;
    cropStyle: string;
    showTitles: boolean;
    showDescriptions: boolean;
    hoverEffects: boolean;
  };
}

interface EnhancedPortfolioCustomizerProps {
  portfolioId: string;
  currentSettings?: Partial<CustomizationSettings>;
  onSave: (settings: CustomizationSettings) => void;
}

const EnhancedPortfolioCustomizer = ({ 
  portfolioId, 
  currentSettings, 
  onSave 
}: EnhancedPortfolioCustomizerProps) => {
  const [settings, setSettings] = useState<CustomizationSettings>({
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#f59e0b',
      ...currentSettings?.theme
    },
    layout: {
      template: 'grid',
      gridColumns: 3,
      spacing: 16,
      borderRadius: 8,
      showHeader: true,
      showBio: true,
      showSocialLinks: true,
      ...currentSettings?.layout
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingSize: 24,
      bodySize: 16,
      lineHeight: 1.6,
      ...currentSettings?.typography
    },
    images: {
      aspectRatio: 'auto',
      cropStyle: 'center',
      showTitles: true,
      showDescriptions: true,
      hoverEffects: true,
      ...currentSettings?.images
    }
  });

  const [history, setHistory] = useState<CustomizationSettings[]>([settings]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const updateSettings = (section: keyof CustomizationSettings, updates: any) => {
    const newSettings = {
      ...settings,
      [section]: { ...settings[section], ...updates }
    };
    
    setSettings(newSettings);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSettings);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSettings(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSettings(history[historyIndex + 1]);
    }
  };

  const handleSave = () => {
    onSave(settings);
    toast({
      title: "Settings Saved",
      description: "Your portfolio customization has been saved successfully.",
    });
  };

  const presetThemes = [
    { name: 'Classic', colors: { primaryColor: '#3b82f6', secondaryColor: '#64748b', backgroundColor: '#ffffff', textColor: '#1e293b', accentColor: '#f59e0b' } },
    { name: 'Dark', colors: { primaryColor: '#8b5cf6', secondaryColor: '#6b7280', backgroundColor: '#111827', textColor: '#f9fafb', accentColor: '#fbbf24' } },
    { name: 'Warm', colors: { primaryColor: '#dc2626', secondaryColor: '#78716c', backgroundColor: '#fef7f0', textColor: '#292524', accentColor: '#ea580c' } },
    { name: 'Cool', colors: { primaryColor: '#0891b2', secondaryColor: '#64748b', backgroundColor: '#f0f9ff', textColor: '#0f172a', accentColor: '#0284c7' } },
    { name: 'Monochrome', colors: { primaryColor: '#374151', secondaryColor: '#6b7280', backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#4b5563' } }
  ];

  const templateOptions = [
    { value: 'grid', label: 'Grid Layout', description: 'Classic grid arrangement' },
    { value: 'masonry', label: 'Masonry', description: 'Pinterest-style layout' },
    { value: 'slider', label: 'Slider', description: 'Horizontal scrolling' },
    { value: 'stack', label: 'Stack', description: 'Vertical stacking' }
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 
    'Merriweather', 'Source Sans Pro', 'Poppins', 'Nunito'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Portfolio Customizer</h3>
          <p className="text-sm text-muted-foreground">
            Customize the look and feel of your portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Theme Settings */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preset Themes */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Preset Themes</Label>
                <div className="grid grid-cols-5 gap-3">
                  {presetThemes.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => updateSettings('theme', preset.colors)}
                    >
                      <div className="flex gap-1">
                        {Object.values(preset.colors).slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) => updateSettings('theme', { primaryColor: e.target.value })}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      value={settings.theme.primaryColor}
                      onChange={(e) => updateSettings('theme', { primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => updateSettings('theme', { secondaryColor: e.target.value })}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      value={settings.theme.secondaryColor}
                      onChange={(e) => updateSettings('theme', { secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={settings.theme.backgroundColor}
                      onChange={(e) => updateSettings('theme', { backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      value={settings.theme.backgroundColor}
                      onChange={(e) => updateSettings('theme', { backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.theme.accentColor}
                      onChange={(e) => updateSettings('theme', { accentColor: e.target.value })}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      value={settings.theme.accentColor}
                      onChange={(e) => updateSettings('theme', { accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div>
                <Label>Portfolio Template</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {templateOptions.map((template) => (
                    <Button
                      key={template.value}
                      variant={settings.layout.template === template.value ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-start gap-2"
                      onClick={() => updateSettings('layout', { template: template.value })}
                    >
                      <span className="font-medium">{template.label}</span>
                      <span className="text-xs text-muted-foreground">{template.description}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Grid Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Grid Columns: {settings.layout.gridColumns}</Label>
                  <Slider
                    value={[settings.layout.gridColumns]}
                    onValueChange={([value]) => updateSettings('layout', { gridColumns: value })}
                    min={1}
                    max={6}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Spacing: {settings.layout.spacing}px</Label>
                  <Slider
                    value={[settings.layout.spacing]}
                    onValueChange={([value]) => updateSettings('layout', { spacing: value })}
                    min={0}
                    max={48}
                    step={4}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <Label>Border Radius: {settings.layout.borderRadius}px</Label>
                <Slider
                  value={[settings.layout.borderRadius]}
                  onValueChange={([value]) => updateSettings('layout', { borderRadius: value })}
                  min={0}
                  max={24}
                  step={2}
                  className="mt-2"
                />
              </div>

              {/* Visibility Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showHeader">Show Header</Label>
                  <Switch
                    id="showHeader"
                    checked={settings.layout.showHeader}
                    onCheckedChange={(checked) => updateSettings('layout', { showHeader: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showBio">Show Bio</Label>
                  <Switch
                    id="showBio"
                    checked={settings.layout.showBio}
                    onCheckedChange={(checked) => updateSettings('layout', { showBio: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showSocialLinks">Show Social Links</Label>
                  <Switch
                    id="showSocialLinks"
                    checked={settings.layout.showSocialLinks}
                    onCheckedChange={(checked) => updateSettings('layout', { showSocialLinks: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Settings */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Heading Font</Label>
                  <Select
                    value={settings.typography.headingFont}
                    onValueChange={(value) => updateSettings('typography', { headingFont: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Body Font</Label>
                  <Select
                    value={settings.typography.bodyFont}
                    onValueChange={(value) => updateSettings('typography', { bodyFont: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Font Sizes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Heading Size: {settings.typography.headingSize}px</Label>
                  <Slider
                    value={[settings.typography.headingSize]}
                    onValueChange={([value]) => updateSettings('typography', { headingSize: value })}
                    min={16}
                    max={48}
                    step={2}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Body Size: {settings.typography.bodySize}px</Label>
                  <Slider
                    value={[settings.typography.bodySize]}
                    onValueChange={([value]) => updateSettings('typography', { bodySize: value })}
                    min={12}
                    max={24}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Line Height */}
              <div>
                <Label>Line Height: {settings.typography.lineHeight}</Label>
                <Slider
                  value={[settings.typography.lineHeight]}
                  onValueChange={([value]) => updateSettings('typography', { lineHeight: value })}
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Settings */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Aspect Ratio */}
              <div>
                <Label>Aspect Ratio</Label>
                <Select
                  value={settings.images.aspectRatio}
                  onValueChange={(value) => updateSettings('images', { aspectRatio: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="4:3">Standard (4:3)</SelectItem>
                    <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                    <SelectItem value="3:2">Photo (3:2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Crop Style */}
              <div>
                <Label>Crop Style</Label>
                <Select
                  value={settings.images.cropStyle}
                  onValueChange={(value) => updateSettings('images', { cropStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTitles">Show Image Titles</Label>
                  <Switch
                    id="showTitles"
                    checked={settings.images.showTitles}
                    onCheckedChange={(checked) => updateSettings('images', { showTitles: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showDescriptions">Show Descriptions</Label>
                  <Switch
                    id="showDescriptions"
                    checked={settings.images.showDescriptions}
                    onCheckedChange={(checked) => updateSettings('images', { showDescriptions: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hoverEffects">Enable Hover Effects</Label>
                  <Switch
                    id="hoverEffects"
                    checked={settings.images.hoverEffects}
                    onCheckedChange={(checked) => updateSettings('images', { hoverEffects: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Advanced customization options will be available in future updates. 
                  This includes custom CSS, animations, and third-party integrations.
                </p>
              </div>

              {/* Export/Import Settings */}
              <div className="space-y-4">
                <div>
                  <Label>Export Settings</Label>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'portfolio-settings.json';
                      a.click();
                    }}
                  >
                    Download Settings JSON
                  </Button>
                </div>
                
                <div>
                  <Label>Import Settings</Label>
                  <Input
                    type="file"
                    accept=".json"
                    className="mt-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const importedSettings = JSON.parse(event.target?.result as string);
                            setSettings(importedSettings);
                            toast({
                              title: "Settings Imported",
                              description: "Portfolio settings have been successfully imported.",
                            });
                          } catch (error) {
                            toast({
                              title: "Import Failed",
                              description: "Invalid settings file format.",
                              variant: "destructive",
                            });
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedPortfolioCustomizer;
