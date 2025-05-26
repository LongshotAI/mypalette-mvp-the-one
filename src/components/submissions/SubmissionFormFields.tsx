
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image, Link as LinkIcon, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SubmissionData {
  title: string;
  description: string;
  medium: string;
  year: string;
  dimensions: string;
  artist_statement: string;
  image_urls: string[];
  external_links: string[];
}

interface SubmissionFormFieldsProps {
  submissionData: SubmissionData;
  onDataChange: (data: SubmissionData) => void;
  requirements?: any;
}

const SubmissionFormFields = ({ submissionData, onDataChange, requirements }: SubmissionFormFieldsProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newExternalLink, setNewExternalLink] = useState('');

  const updateField = (field: keyof SubmissionData, value: any) => {
    onDataChange({ ...submissionData, [field]: value });
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      updateField('image_urls', [...submissionData.image_urls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    updateField('image_urls', submissionData.image_urls.filter((_, i) => i !== index));
  };

  const addExternalLink = () => {
    if (newExternalLink.trim()) {
      updateField('external_links', [...submissionData.external_links, newExternalLink.trim()]);
      setNewExternalLink('');
    }
  };

  const removeExternalLink = (index: number) => {
    updateField('external_links', submissionData.external_links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Artwork Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Artwork Title *</Label>
            <Input
              id="title"
              value={submissionData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter artwork title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={submissionData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe your artwork"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="medium">Medium *</Label>
              <Select value={submissionData.medium} onValueChange={(value) => updateField('medium', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="digital">Digital Art</SelectItem>
                  <SelectItem value="mixed-media">Mixed Media</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="video">Video Art</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year">Year Created</Label>
              <Input
                id="year"
                value={submissionData.year}
                onChange={(e) => updateField('year', e.target.value)}
                placeholder="2024"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={submissionData.dimensions}
                onChange={(e) => updateField('dimensions', e.target.value)}
                placeholder="e.g., 24 x 36 inches"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artist Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Artist Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="artist_statement">Statement about this work</Label>
            <Textarea
              id="artist_statement"
              value={submissionData.artist_statement}
              onChange={(e) => updateField('artist_statement', e.target.value)}
              placeholder="Share your artistic vision, inspiration, and process for this work..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Artwork Images *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1"
            />
            <Button onClick={addImageUrl} disabled={!newImageUrl.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {submissionData.image_urls.length > 0 && (
            <div className="space-y-2">
              {submissionData.image_urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <Image className="h-4 w-4" />
                  <span className="flex-1 text-sm truncate">{url}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImageUrl(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Add URLs to high-quality images of your artwork. At least one image is required.
          </p>
        </CardContent>
      </Card>

      {/* External Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Additional Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newExternalLink}
              onChange={(e) => setNewExternalLink(e.target.value)}
              placeholder="Enter additional link (portfolio, social media, etc.)"
              className="flex-1"
            />
            <Button onClick={addExternalLink} disabled={!newExternalLink.trim()}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {submissionData.external_links.length > 0 && (
            <div className="space-y-2">
              {submissionData.external_links.map((link, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <LinkIcon className="h-4 w-4" />
                  <span className="flex-1 text-sm truncate">{link}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExternalLink(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Optional: Add links to your portfolio, social media, or other relevant pages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionFormFields;
