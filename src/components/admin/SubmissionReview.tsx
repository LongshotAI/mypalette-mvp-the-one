
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  DollarSign,
  Eye,
  FileText,
  Image as ImageIcon 
} from 'lucide-react';
import { useSubmissions } from '@/hooks/useSubmissions';

interface SubmissionReviewProps {
  submission: any;
  onStatusUpdate?: () => void;
}

const SubmissionReview = ({ submission, onStatusUpdate }: SubmissionReviewProps) => {
  const [notes, setNotes] = useState(submission.curator_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateSubmissionStatus } = useSubmissions();

  const handleStatusUpdate = async (isSelected: boolean) => {
    setIsUpdating(true);
    try {
      await updateSubmissionStatus.mutateAsync({
        submissionId: submission.id,
        isSelected,
        notes
      });
      onStatusUpdate?.();
    } catch (error) {
      console.error('Error updating submission status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const submissionData = submission.submission_data || {};

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={submission.profiles?.avatar_url} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {submissionData.title || 'Untitled Submission'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                by {submission.profiles?.first_name && submission.profiles?.last_name 
                  ? `${submission.profiles.first_name} ${submission.profiles.last_name}`
                  : submission.profiles?.username || 'Unknown Artist'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={submission.is_selected ? 'default' : 'secondary'}>
              {submission.is_selected ? 'Selected' : 'Pending'}
            </Badge>
            <Badge variant={submission.payment_status === 'paid' ? 'default' : 'outline'}>
              {submission.payment_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Submission Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Status: {submission.payment_status}</span>
          </div>
        </div>

        {/* Artwork Description */}
        {submissionData.description && (
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{submissionData.description}</p>
          </div>
        )}

        {/* Medium and Year */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          {submissionData.medium && (
            <div>
              <span className="font-medium">Medium:</span>
              <p className="text-muted-foreground">{submissionData.medium}</p>
            </div>
          )}
          {submissionData.year && (
            <div>
              <span className="font-medium">Year:</span>
              <p className="text-muted-foreground">{submissionData.year}</p>
            </div>
          )}
          {submissionData.dimensions && (
            <div>
              <span className="font-medium">Dimensions:</span>
              <p className="text-muted-foreground">{submissionData.dimensions}</p>
            </div>
          )}
        </div>

        {/* Images */}
        {submissionData.image_urls && submissionData.image_urls.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Images ({submissionData.image_urls.length})
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {submissionData.image_urls.slice(0, 3).map((url: string, index: number) => (
                <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artist Statement */}
        {submissionData.artist_statement && (
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Artist Statement
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {submissionData.artist_statement}
            </p>
          </div>
        )}

        {/* Curator Notes */}
        <div>
          <Label htmlFor="notes">Curator Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this submission..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button
            onClick={() => handleStatusUpdate(true)}
            disabled={isUpdating || submission.is_selected}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {submission.is_selected ? 'Selected' : 'Select'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate(false)}
            disabled={isUpdating || !submission.is_selected}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button variant="outline" disabled={isUpdating}>
            <Eye className="h-4 w-4 mr-2" />
            View Full Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionReview;
