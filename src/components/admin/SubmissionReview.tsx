
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Star, MessageSquare, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Submission, SubmissionData } from '@/types/submission';

interface SubmissionReviewProps {
  openCallId: string;
}

const SubmissionReview = ({ openCallId }: SubmissionReviewProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [curatorNotes, setCuratorNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions-review', openCallId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles(username, first_name, last_name, avatar_url)
        `)
        .eq('open_call_id', openCallId)
        .in('payment_status', ['paid', 'free'])
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as Submission[];
    },
  });

  const updateSubmissionStatus = useMutation({
    mutationFn: async ({ id, isSelected, notes }: { id: string; isSelected: boolean; notes?: string }) => {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          is_selected: isSelected,
          curator_notes: notes
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-review'] });
      toast({
        title: "Submission Updated",
        description: "Submission status has been updated successfully.",
      });
    },
  });

  const handleSelectSubmission = (submission: Submission, selected: boolean) => {
    updateSubmissionStatus.mutate({
      id: submission.id,
      isSelected: selected,
      notes: curatorNotes
    });
    setCuratorNotes('');
  };

  const getSubmissionData = (submission: Submission): SubmissionData => {
    return (submission.submission_data as SubmissionData) || {};
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Submissions ({submissions?.length || 0})
        </h3>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">
            Selected: {submissions?.filter(s => s.is_selected).length || 0}
          </Badge>
          <Badge variant="outline">
            Pending: {submissions?.filter(s => !s.is_selected).length || 0}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {submissions?.map((submission) => {
          const submissionData = getSubmissionData(submission);
          
          return (
            <Card key={submission.id} className={submission.is_selected ? 'ring-2 ring-green-500' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {submissionData.title || 'Untitled Submission'}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      by {submission.profiles?.first_name || 'Unknown'} {submission.profiles?.last_name || ''}
                      ({submission.profiles?.username || 'No username'})
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.is_selected && (
                      <Badge className="bg-green-500">Selected</Badge>
                    )}
                    <Badge variant="outline">
                      {submission.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {submissionData.description || 'No description provided'}
                </p>

                {submissionData.artist_statement && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Artist Statement:</strong>
                    <p className="mt-1 line-clamp-2">{submissionData.artist_statement}</p>
                  </div>
                )}

                {submissionData.files && submissionData.files.length > 0 && (
                  <div className="flex gap-2">
                    <Download className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      {submissionData.files.length} file(s) attached
                    </span>
                  </div>
                )}

                {submission.curator_notes && (
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <strong>Curator Notes:</strong> {submission.curator_notes}
                  </div>
                )}

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>
                          {submissionData.title || 'Submission Details'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Description</h4>
                          <p className="text-sm text-gray-700">
                            {submissionData.description || 'No description provided'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Artist Statement</h4>
                          <p className="text-sm text-gray-700">
                            {submissionData.artist_statement || 'No artist statement provided'}
                          </p>
                        </div>
                        {submissionData.files && submissionData.files.length > 0 && (
                          <div>
                            <h4 className="font-semibold">Attached Files</h4>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              {submissionData.files.map((file, index) => (
                                <div key={index} className="border rounded p-2">
                                  {file.file_type?.startsWith('image/') ? (
                                    <img 
                                      src={file.file_url} 
                                      alt={file.file_name}
                                      className="w-full h-32 object-cover rounded"
                                    />
                                  ) : (
                                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                      <span className="text-sm text-gray-600">{file.file_name}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {!submission.is_selected ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Star className="h-4 w-4 mr-1" />
                          Select
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Select Submission</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Add curator notes (optional)"
                            value={curatorNotes}
                            onChange={(e) => setCuratorNotes(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSelectSubmission(submission, true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Confirm Selection
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectSubmission(submission, false)}
                    >
                      Deselect
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Add Notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Curator Notes</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Add feedback or notes for this submission"
                          value={curatorNotes}
                          onChange={(e) => setCuratorNotes(e.target.value)}
                        />
                        <Button
                          onClick={() => updateSubmissionStatus.mutate({
                            id: submission.id,
                            isSelected: submission.is_selected,
                            notes: curatorNotes
                          })}
                        >
                          Save Notes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {submissions?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      )}
    </div>
  );
};

export default SubmissionReview;
