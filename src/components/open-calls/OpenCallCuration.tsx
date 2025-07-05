import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, Award, Users, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Submission } from '@/types/submission';
import SubmissionsList from './SubmissionsList';

interface OpenCallCurationProps {
  openCallId: string;
  openCall: {
    id: string;
    title: string;
    num_winners?: number;
    organization_name?: string;
    submission_deadline: string;
    status: string;
  };
}

const OpenCallCuration = ({ openCallId, openCall }: OpenCallCurationProps) => {
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [curationNotes, setCurationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const maxWinners = openCall.num_winners || 1;
  const isExpired = new Date(openCall.submission_deadline) < new Date();
  const isCurated = openCall.status === 'curated';

  // Mutation to finalize curation
  const finalizeCuration = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Starting curation process for:', openCallId);
      console.log('Selected winners:', selectedWinners);

      // Update selected submissions as winners
      if (selectedWinners.length > 0) {
        const { error: submissionError } = await supabase
          .from('submissions')
          .update({ is_selected: true })
          .in('id', selectedWinners);

        if (submissionError) {
          console.error('Error updating submissions:', submissionError);
          throw new Error(`Failed to update submissions: ${submissionError.message}`);
        }
        console.log('Successfully updated selected submissions');
      }

      // Update open call status to curated
      const { error: openCallError } = await supabase
        .from('open_calls')
        .update({ 
          status: 'curated',
          admin_notes: curationNotes
        })
        .eq('id', openCallId);

      if (openCallError) {
        console.error('Error updating open call:', openCallError);
        throw new Error(`Failed to update open call: ${openCallError.message}`);
      }
      console.log('Successfully updated open call status');

      // Log curation action (non-critical)
      try {
        if (selectedWinners.length > 0) {
          for (const winnerId of selectedWinners) {
            await supabase
              .from('submission_curation')
              .insert({
                submission_id: winnerId,
                curator_id: user.id,
                curator_type: 'admin',
                action: 'finalize_curation',
                notes: `Selected as winner for "${openCall.title}". ${curationNotes}`
              });
          }
        }
        console.log('Successfully logged curation actions');
      } catch (logError) {
        console.warn('Failed to log curation action (non-critical):', logError);
        // Don't throw - this is non-critical
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-call', openCallId] });
      queryClient.invalidateQueries({ queryKey: ['submissions-list', openCallId] });
      toast({
        title: "Curation Complete",
        description: `Successfully selected ${selectedWinners.length} winners for this open call.`,
      });
    },
    onError: (error) => {
      console.error('Curation failed:', error);
      toast({
        title: "Curation Failed",
        description: error instanceof Error ? error.message : "Failed to complete curation. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFinalizeCuration = () => {
    if (selectedWinners.length === 0) {
      toast({
        title: "No Winners Selected",
        description: "Please select at least one winner before finalizing curation.",
        variant: "destructive"
      });
      return;
    }

    if (selectedWinners.length > maxWinners) {
      toast({
        title: "Too Many Winners",
        description: `You can only select up to ${maxWinners} winners for this open call.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    finalizeCuration.mutate();
    setIsSubmitting(false);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    if (selectedIds.length > maxWinners) {
      toast({
        title: "Selection Limit Reached",
        description: `You can only select up to ${maxWinners} winners.`,
        variant: "destructive"
      });
      return;
    }
    setSelectedWinners(selectedIds);
  };

  if (!isExpired && openCall.status !== 'under_curation') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Curation Not Available</h3>
          <p className="text-muted-foreground">
            This open call is still accepting submissions. Curation will be available after the deadline.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isCurated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium mb-2">Curation Complete</h3>
          <p className="text-muted-foreground">
            Winners have been selected for this open call. View the results below.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Curation Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Curate "{openCall.title}"
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Winners to Select</p>
                <p className="text-sm text-muted-foreground">{maxWinners} maximum</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Currently Selected</p>
                <p className="text-sm text-muted-foreground">{selectedWinners.length} of {maxWinners}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Deadline Passed</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(openCall.submission_deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Selection Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Selection Progress</span>
              <span>{selectedWinners.length}/{maxWinners}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(selectedWinners.length / maxWinners) * 100}%` }}
              />
            </div>
          </div>

          {/* Status Alerts */}
          {selectedWinners.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Select submissions below to choose winners for this open call.
              </AlertDescription>
            </Alert>
          )}

          {selectedWinners.length > 0 && selectedWinners.length < maxWinners && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have selected {selectedWinners.length} winner(s). You can select up to {maxWinners - selectedWinners.length} more.
              </AlertDescription>
            </Alert>
          )}

          {selectedWinners.length === maxWinners && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Perfect! You have selected the maximum number of winners ({maxWinners}).
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Curation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Curation Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="curation-notes">
              Add notes about your curation decision (optional)
            </Label>
            <Textarea
              id="curation-notes"
              placeholder="Explain your selection criteria, decision process, or any other relevant notes..."
              value={curationNotes}
              onChange={(e) => setCurationNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submissions for Curation */}
      <Card>
        <CardHeader>
          <CardTitle>Select Winners</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionsList
            openCallId={openCallId}
            showFilters={true}
            allowSelection={true}
            onSelectionChange={handleSelectionChange}
          />
        </CardContent>
      </Card>

      {/* Finalize Curation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Ready to Finalize?</h3>
              <p className="text-sm text-muted-foreground">
                Once finalized, the selected winners will be displayed publicly and the open call will be marked as complete.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  disabled={selectedWinners.length === 0}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Finalize Curation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Curation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>You are about to finalize the curation for "{openCall.title}" with the following selections:</p>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Selected Winners: {selectedWinners.length}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedWinners.length === 1 ? '1 submission' : `${selectedWinners.length} submissions`} will be marked as winner(s)
                    </p>
                  </div>

                  {curationNotes && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Curation Notes:</h4>
                      <p className="text-sm text-muted-foreground">{curationNotes}</p>
                    </div>
                  )}

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This action cannot be undone. Winners will be displayed publicly and the open call will be marked as complete.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2 justify-end">
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <Button 
                      onClick={handleFinalizeCuration}
                      disabled={isSubmitting}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      {isSubmitting ? 'Finalizing...' : 'Confirm & Finalize'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenCallCuration;