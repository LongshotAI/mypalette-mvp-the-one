
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
import { Eye, Star, MessageSquare, Download, FileText, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Submission, SubmissionData, SubmissionFile } from '@/types/submission';
import { useSubmissions } from '@/hooks/useSubmissions';
import { convertToSubmissionData } from '@/utils/typeGuards';

interface SubmissionReviewProps {
  openCallId: string;
}

const SubmissionReview = ({ openCallId }: SubmissionReviewProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
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
          profiles(first_name, last_name, username, avatar_url)
        `)
        .eq('open_call_id', openCallId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(submission => ({
        ...submission,
        submission_data: convertToSubmissionData(submission.submission_data)
      })) as Submission[];
    },
  });

  const createReview = useMutation({
    mutationFn: async ({ submissionId, reviewData }: { submissionId: string; reviewData: any }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // For now, we'll store review data in curator_notes since we don't have review tables
      const reviewText = `Rating: ${reviewData.rating}/5, Technical: ${reviewData.technicalQuality}/10, Artistic: ${reviewData.artisticMerit}/10, Theme: ${reviewData.themeRelevance}/10, Overall: ${reviewData.overallScore}/10\n\nReview Notes: ${reviewData.reviewNotes}\n\nPrivate Notes: ${reviewData.privateNotes}`;
      
      const { error } = await supabase
        .from('submissions')
        .update({ curator_notes: reviewText })
        .eq('id', submissionId);

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

  const getSubmissionData = (submission: Submission): SubmissionData => {
    return submission.submission_data || {
      title: '',
      description: '',
      medium: '',
      year: '',
      dimensions: '',
      artist_statement: '',
      image_urls: [],
      external_links: [],
      files: []
    };
  };

  const getSubmissionTitle = (submission: Submission): string => {
    const submissionData = getSubmissionData(submission);
    return submissionData.title || 'Untitled Submission';
  };

  const getSubmissionDescription = (submission: Submission): string => {
    const submissionData = getSubmissionData(submission);
    return submissionData.description || 'No description provided';
  };

  const getArtistStatement = (submission: Submission): string => {
    const submissionData = getSubmissionData(submission);
    return submissionData.artist_statement || 'No artist statement provided';
  };

  const getSubmissionFiles = (submission: Submission): SubmissionFile[] => {
    const submissionData = getSubmissionData(submission);
    return submissionData.files || [];
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
          const files = getSubmissionFiles(submission);
          
          return (
            <Card key={submission.id} className={submission.is_selected ? 'ring-2 ring-green-500' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {getSubmissionTitle(submission)}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      by {submission.profiles?.first_name || 'Unknown'} {submission.profiles?.last_name || ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-col">
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
                  {getSubmissionDescription(submission)}
                </p>

                {getArtistStatement(submission) !== 'No artist statement provided' && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Artist Statement:</strong>
                    <p className="mt-1 line-clamp-2">
                      {getArtistStatement(submission)}
                    </p>
                  </div>
                )}

                {files.length > 0 && (
                  <div className="flex gap-2">
                    <Download className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      {files.length} file(s) attached
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
                          {getSubmissionTitle(submission)}
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
                              <strong>Username:</strong> {submission.profiles?.username}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Submission Info</h4>
                            <p className="text-sm">
                              <strong>Payment:</strong> {submission.payment_status}
                            </p>
                            <p className="text-sm">
                              <strong>Medium:</strong> {submissionData.medium}
                            </p>
                            {submissionData.year && (
                              <p className="text-sm">
                                <strong>Year:</strong> {submissionData.year}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">Description</h4>
                          <p className="text-sm text-gray-700">
                            {getSubmissionDescription(submission)}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">Artist Statement</h4>
                          <p className="text-sm text-gray-700">
                            {getArtistStatement(submission)}
                          </p>
                        </div>
                        
                        {files.length > 0 && (
                          <div>
                            <h4 className="font-semibold">Attached Files</h4>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              {files.map((file, index) => (
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

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const newStatus = prompt('Enter new status (under_review, shortlisted, selected, rejected, waitlisted):');
                      const notes = prompt('Enter notes (optional):');
                      if (newStatus) {
                        updateSubmissionStatus.mutate({
                          submissionId: submission.id,
                          status: newStatus,
                          notes: notes || undefined
                        });
                      }
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Update Status
                  </Button>
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
