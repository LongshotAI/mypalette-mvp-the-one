
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Star, MessageSquare, Download, FileText, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Submission, SubmissionData } from '@/types/submission';
import { useSubmissions } from '@/hooks/useSubmissions';

interface SubmissionReviewProps {
  openCallId: string;
}

const SubmissionReview = ({ openCallId }: SubmissionReviewProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [curatorNotes, setCuratorNotes] = useState('');
  const [reviewData, setReviewData] = useState({
    rating: 5,
    technicalQuality: 5,
    artisticMerit: 5,
    themeRelevance: 5,
    overallScore: 5,
    reviewNotes: '',
    privateNotes: ''
  });
  const queryClient = useQueryClient();
  const { updateSubmissionStatus } = useSubmissions();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions-review', openCallId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles(username, first_name, last_name, avatar_url, email),
          submission_workflow(status, notes, created_at),
          submission_reviews(rating, overall_score, review_notes, review_status)
        `)
        .eq('open_call_id', openCallId)
        .in('payment_status', ['paid', 'free'])
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as Submission[];
    },
  });

  const createReview = useMutation({
    mutationFn: async ({ submissionId, reviewData }: { submissionId: string; reviewData: any }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('submission_reviews')
        .upsert({
          submission_id: submissionId,
          reviewer_id: user.id,
          rating: reviewData.rating,
          technical_quality_score: reviewData.technicalQuality,
          artistic_merit_score: reviewData.artisticMerit,
          theme_relevance_score: reviewData.themeRelevance,
          overall_score: reviewData.overallScore,
          review_notes: reviewData.reviewNotes,
          private_notes: reviewData.privateNotes,
          review_status: 'completed'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-review'] });
      toast({
        title: "Review Submitted",
        description: "Your review has been saved successfully.",
      });
    },
  });

  const handleSelectSubmission = async (submission: Submission, selected: boolean) => {
    updateSubmissionStatus.mutate({
      submissionId: submission.id,
      status: selected ? 'selected' : 'rejected',
      notes: curatorNotes
    });
    setCuratorNotes('');
  };

  const getSubmissionData = (submission: Submission): SubmissionData => {
    return (submission.submission_data as SubmissionData) || {};
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-yellow-500';
      case 'shortlisted': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
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
            Pending: {submissions?.filter(s => !s.is_selected && s.payment_status === 'paid').length || 0}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {submissions?.map((submission) => {
          const submissionData = getSubmissionData(submission);
          const latestWorkflow = submission.submission_workflow?.[0];
          const latestReview = submission.submission_reviews?.[0];
          
          return (
            <Card key={submission.id} className={submission.is_selected ? 'ring-2 ring-green-500' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {submission.submission_title || submissionData.title || 'Untitled Submission'}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      by {submission.profiles?.first_name || 'Unknown'} {submission.profiles?.last_name || ''}
                      ({submission.profiles?.email || 'No email'})
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-col">
                    {submission.is_selected && (
                      <Badge className="bg-green-500">Selected</Badge>
                    )}
                    {latestWorkflow && (
                      <Badge className={getStatusColor(latestWorkflow.status)}>
                        {latestWorkflow.status}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {submission.payment_status}
                    </Badge>
                    {latestReview && (
                      <Badge variant="secondary">
                        Score: {latestReview.overall_score}/10
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {submission.submission_description || submissionData.description || 'No description provided'}
                </p>

                {(submission.artist_statement || submissionData.artist_statement) && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Artist Statement:</strong>
                    <p className="mt-1 line-clamp-2">
                      {submission.artist_statement || submissionData.artist_statement}
                    </p>
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

                <div className="flex gap-2 flex-wrap">
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
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {submission.submission_title || submissionData.title || 'Submission Details'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Artist Information</h4>
                            <p className="text-sm">
                              <strong>Name:</strong> {submission.profiles?.first_name} {submission.profiles?.last_name}
                            </p>
                            <p className="text-sm">
                              <strong>Email:</strong> {submission.profiles?.email}
                            </p>
                            <p className="text-sm">
                              <strong>Username:</strong> {submission.profiles?.username}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Submission Info</h4>
                            <p className="text-sm">
                              <strong>Status:</strong> {latestWorkflow?.status || 'submitted'}
                            </p>
                            <p className="text-sm">
                              <strong>Payment:</strong> {submission.payment_status}
                            </p>
                            <p className="text-sm">
                              <strong>Amount:</strong> ${submission.payment_amount || 0}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">Description</h4>
                          <p className="text-sm text-gray-700">
                            {submission.submission_description || submissionData.description || 'No description provided'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">Artist Statement</h4>
                          <p className="text-sm text-gray-700">
                            {submission.artist_statement || submissionData.artist_statement || 'No artist statement provided'}
                          </p>
                        </div>
                        
                        {submissionData.files && submissionData.files.length > 0 && (
                          <div>
                            <h4 className="font-semibold">Attached Files</h4>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              {submissionData.files.map((file, index) => (
                                <div key={index} className="border rounded p-2">
                                  {file.file_type?.startsWith('image/') ? (
                                    <div className="relative">
                                      <Image className="h-4 w-4 absolute top-2 right-2 text-white bg-black rounded" />
                                      <img 
                                        src={file.file_url} 
                                        alt={file.file_name}
                                        className="w-full h-32 object-cover rounded"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                      <div className="text-center">
                                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                                        <span className="text-sm text-gray-600">{file.file_name}</span>
                                      </div>
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1 truncate">{file.file_name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Star className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Review Submission</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Overall Rating (1-5)</Label>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              value={reviewData.rating}
                              onChange={(e) => setReviewData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <Label>Overall Score (1-10)</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={reviewData.overallScore}
                              onChange={(e) => setReviewData(prev => ({ ...prev, overallScore: Number(e.target.value) }))}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Technical Quality (1-10)</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={reviewData.technicalQuality}
                              onChange={(e) => setReviewData(prev => ({ ...prev, technicalQuality: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <Label>Artistic Merit (1-10)</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={reviewData.artisticMerit}
                              onChange={(e) => setReviewData(prev => ({ ...prev, artisticMerit: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <Label>Theme Relevance (1-10)</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={reviewData.themeRelevance}
                              onChange={(e) => setReviewData(prev => ({ ...prev, themeRelevance: Number(e.target.value) }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Review Notes (Public)</Label>
                          <Textarea
                            placeholder="Feedback visible to the artist"
                            value={reviewData.reviewNotes}
                            onChange={(e) => setReviewData(prev => ({ ...prev, reviewNotes: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label>Private Notes</Label>
                          <Textarea
                            placeholder="Internal notes for admin/curator use only"
                            value={reviewData.privateNotes}
                            onChange={(e) => setReviewData(prev => ({ ...prev, privateNotes: e.target.value }))}
                          />
                        </div>

                        <Button
                          onClick={() => createReview.mutate({
                            submissionId: submission.id,
                            reviewData
                          })}
                          className="w-full"
                        >
                          Submit Review
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Update Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Submission Status</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>New Status</Label>
                          <Select onValueChange={(value) => setCuratorNotes('')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="selected">Selected</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="waitlisted">Waitlisted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Add notes about this status change"
                            value={curatorNotes}
                            onChange={(e) => setCuratorNotes(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const statusValue = document.querySelector('[role="combobox"]')?.getAttribute('data-value');
                              if (statusValue) {
                                updateSubmissionStatus.mutate({
                                  submissionId: submission.id,
                                  status: statusValue,
                                  notes: curatorNotes
                                });
                              }
                            }}
                            className="flex-1"
                          >
                            Update Status
                          </Button>
                        </div>
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
