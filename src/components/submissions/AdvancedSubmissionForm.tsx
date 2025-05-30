
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Image, 
  FileText, 
  Link as LinkIcon, 
  CheckCircle, 
  AlertCircle,
  Plus,
  X,
  Info
} from 'lucide-react';
import { SubmissionData } from '@/types/submission';
import FileUploadZone from './FileUploadZone';

interface AdvancedSubmissionFormProps {
  submissionData: SubmissionData;
  onDataChange: (data: SubmissionData) => void;
  requirements?: any;
  submissionId?: string;
}

const AdvancedSubmissionForm = ({ 
  submissionData, 
  onDataChange, 
  requirements,
  submissionId 
}: AdvancedSubmissionFormProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const sections = [
    { id: 1, title: 'Artwork Details', icon: Image },
    { id: 2, title: 'Artist Statement', icon: FileText },
    { id: 3, title: 'Files & Media', icon: Upload },
    { id: 4, title: 'Additional Info', icon: LinkIcon }
  ];

  const updateField = (field: keyof SubmissionData, value: any) => {
    onDataChange({
      ...submissionData,
      [field]: value
    });
    
    // Clear validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addExternalLink = () => {
    const newLinks = [...(submissionData.external_links || []), ''];
    updateField('external_links', newLinks);
  };

  const updateExternalLink = (index: number, value: string) => {
    const newLinks = [...(submissionData.external_links || [])];
    newLinks[index] = value;
    updateField('external_links', newLinks);
  };

  const removeExternalLink = (index: number) => {
    const newLinks = submissionData.external_links?.filter((_, i) => i !== index) || [];
    updateField('external_links', newLinks);
  };

  const validateSection = (sectionId: number): boolean => {
    const errors: Record<string, string> = {};

    switch (sectionId) {
      case 1:
        if (!submissionData.title?.trim()) errors.title = 'Title is required';
        if (!submissionData.description?.trim()) errors.description = 'Description is required';
        if (!submissionData.medium?.trim()) errors.medium = 'Medium is required';
        if (!submissionData.year?.trim()) errors.year = 'Year is required';
        break;
      case 2:
        if (!submissionData.artist_statement?.trim()) errors.artist_statement = 'Artist statement is required';
        break;
      case 3:
        if (!submissionData.image_urls || submissionData.image_urls.length === 0) {
          errors.image_urls = 'At least one image is required';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getCompletionPercentage = (): number => {
    let completed = 0;
    let total = 8; // Total required fields

    if (submissionData.title?.trim()) completed++;
    if (submissionData.description?.trim()) completed++;
    if (submissionData.medium?.trim()) completed++;
    if (submissionData.year?.trim()) completed++;
    if (submissionData.artist_statement?.trim()) completed++;
    if (submissionData.image_urls && submissionData.image_urls.length > 0) completed++;
    if (submissionData.dimensions?.trim()) completed++;
    if (submissionData.external_links && submissionData.external_links.some(link => link.trim())) completed++;

    return Math.round((completed / total) * 100);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Image className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold">Artwork Details</h3>
              <p className="text-muted-foreground">Basic information about your artwork</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Artwork Title *</Label>
                <Input
                  id="title"
                  value={submissionData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter the title of your artwork"
                  className={validationErrors.title ? 'border-red-500' : ''}
                />
                {validationErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={submissionData.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your artwork, its concept, and inspiration..."
                  rows={4}
                  className={validationErrors.description ? 'border-red-500' : ''}
                />
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medium">Medium *</Label>
                  <Select 
                    value={submissionData.medium || ''} 
                    onValueChange={(value) => updateField('medium', value)}
                  >
                    <SelectTrigger className={validationErrors.medium ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital_art">Digital Art</SelectItem>
                      <SelectItem value="ai_generated">AI Generated</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="sculpture">Sculpture</SelectItem>
                      <SelectItem value="mixed_media">Mixed Media</SelectItem>
                      <SelectItem value="video">Video Art</SelectItem>
                      <SelectItem value="animation">Animation</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="performance">Performance Art</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.medium && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.medium}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="year">Year Created *</Label>
                  <Input
                    id="year"
                    value={submissionData.year || ''}
                    onChange={(e) => updateField('year', e.target.value)}
                    placeholder="2024"
                    className={validationErrors.year ? 'border-red-500' : ''}
                  />
                  {validationErrors.year && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.year}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={submissionData.dimensions || ''}
                  onChange={(e) => updateField('dimensions', e.target.value)}
                  placeholder="e.g., 1920x1080 pixels, 24x36 inches, etc."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold">Artist Statement</h3>
              <p className="text-muted-foreground">Share the story behind your work</p>
            </div>

            <div>
              <Label htmlFor="artist_statement">Artist Statement *</Label>
              <Textarea
                id="artist_statement"
                value={submissionData.artist_statement || ''}
                onChange={(e) => updateField('artist_statement', e.target.value)}
                placeholder="Explain your artistic process, inspiration, and the meaning behind this work. What do you want viewers to understand or feel when they experience your art?"
                rows={8}
                className={validationErrors.artist_statement ? 'border-red-500' : ''}
              />
              {validationErrors.artist_statement && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.artist_statement}</p>
              )}
              
              <div className="mt-2 text-sm text-muted-foreground">
                {submissionData.artist_statement?.length || 0} characters
                {submissionData.artist_statement && submissionData.artist_statement.length < 100 && (
                  <span className="text-orange-500 ml-2">
                    Consider adding more detail (minimum 100 characters recommended)
                  </span>
                )}
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                A strong artist statement helps curators and viewers understand your work. 
                Include your inspiration, process, and what you hope to communicate through your art.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold">Files & Media</h3>
              <p className="text-muted-foreground">Upload your artwork files</p>
            </div>

            <div className="space-y-6">
              {submissionId && (
                <FileUploadZone submissionId={submissionId} />
              )}

              <div>
                <Label>Image URLs</Label>
                <div className="space-y-2">
                  {submissionData.image_urls?.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...(submissionData.image_urls || [])];
                          newUrls[index] = e.target.value;
                          updateField('image_urls', newUrls);
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newUrls = submissionData.image_urls?.filter((_, i) => i !== index) || [];
                          updateField('image_urls', newUrls);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )) || []}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newUrls = [...(submissionData.image_urls || []), ''];
                      updateField('image_urls', newUrls);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image URL
                  </Button>
                </div>
                {validationErrors.image_urls && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.image_urls}</p>
                )}
              </div>

              {requirements && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>File Requirements:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {typeof requirements === 'object' && Object.entries(requirements).map(([key, value]) => (
                        <li key={key}>{key}: {String(value)}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <LinkIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold">Additional Information</h3>
              <p className="text-muted-foreground">External links and extra details</p>
            </div>

            <div>
              <Label>External Links</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Add links to your portfolio, social media, or additional documentation
              </p>
              
              <div className="space-y-2">
                {submissionData.external_links?.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={link}
                      onChange={(e) => updateExternalLink(index, e.target.value)}
                      placeholder="https://yourportfolio.com"
                      type="url"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExternalLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )) || []}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExternalLink}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Submission Progress</span>
            <span className="text-sm text-muted-foreground">{getCompletionPercentage()}%</span>
          </div>
          <Progress value={getCompletionPercentage()} className="h-2" />
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = currentSection === section.id;
          const isCompleted = section.id < currentSection || 
            (section.id === 1 && submissionData.title && submissionData.description && submissionData.medium) ||
            (section.id === 2 && submissionData.artist_statement) ||
            (section.id === 3 && submissionData.image_urls && submissionData.image_urls.length > 0);

          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentSection(section.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {section.title}
              {isCompleted && <CheckCircle className="h-3 w-3 text-green-500" />}
            </Button>
          );
        })}
      </div>

      {/* Section Content */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            {renderSection()}
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(prev => Math.max(1, prev - 1))}
          disabled={currentSection === 1}
        >
          Previous
        </Button>

        <Button
          onClick={() => {
            if (validateSection(currentSection)) {
              setCurrentSection(prev => Math.min(sections.length, prev + 1));
            }
          }}
          disabled={currentSection === sections.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSubmissionForm;
