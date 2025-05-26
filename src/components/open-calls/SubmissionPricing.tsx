
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, DollarSign } from 'lucide-react';

interface SubmissionPricingProps {
  currentSubmissions: number;
  maxSubmissions: number;
  onSubmit: () => void;
}

const SubmissionPricing = ({ currentSubmissions, maxSubmissions, onSubmit }: SubmissionPricingProps) => {
  const isFirstSubmission = currentSubmissions === 0;
  const canSubmitMore = currentSubmissions < maxSubmissions;
  const additionalSubmissions = maxSubmissions - currentSubmissions;
  const nextSubmissionPrice = isFirstSubmission ? 0 : 2;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <DollarSign className="h-5 w-5" />
          Submission Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">{currentSubmissions}/{maxSubmissions}</div>
          <div className="text-sm text-muted-foreground">Submissions Used</div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">First Submission</span>
            </div>
            <Badge variant={currentSubmissions > 0 ? "secondary" : "default"}>
              {currentSubmissions > 0 ? "Used" : "FREE"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Additional Submissions</span>
              <div className="text-sm text-muted-foreground">Up to 5 more entries</div>
            </div>
            <div className="text-right">
              <div className="font-medium">$2 each</div>
              <div className="text-sm text-muted-foreground">Total: ${(maxSubmissions - 1) * 2}</div>
            </div>
          </div>
        </div>

        {/* Next Submission */}
        {canSubmitMore && (
          <div className="border-t pt-4">
            <div className="text-center mb-4">
              <div className="text-lg font-semibold">
                Next Submission: {isFirstSubmission ? 'FREE' : '$2'}
              </div>
              {!isFirstSubmission && (
                <div className="text-sm text-muted-foreground">
                  {additionalSubmissions - 1} more submissions available after this
                </div>
              )}
            </div>
            
            <Button 
              onClick={onSubmit}
              className="w-full" 
              size="lg"
            >
              {isFirstSubmission ? 'Submit for Free' : 'Submit for $2'}
            </Button>
          </div>
        )}

        {/* Maxed Out */}
        {!canSubmitMore && (
          <div className="border-t pt-4 text-center">
            <div className="text-muted-foreground mb-2">
              You've reached the maximum submissions for this open call
            </div>
            <Button disabled className="w-full">
              Maximum Submissions Reached
            </Button>
          </div>
        )}

        {/* Benefits */}
        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-2">What's Included:</div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-500" />
              <span>Professional review by curators</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-500" />
              <span>Public exhibition if selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-500" />
              <span>Feedback and networking opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-500" />
              <span>Portfolio visibility boost</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionPricing;
