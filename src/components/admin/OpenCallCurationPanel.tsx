
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Award, 
  Eye, 
  MessageSquare, 
  Download, 
  CheckCircle, 
  XCircle,
  Star,
  Mail,
  Users
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Submission {
  id: string;
  artist_id: string;
  artwork_id: string;
  is_selected: boolean;
  curator_notes: string;
  submitted_at: string;
  payment_status: string;
  submission_data: any;
  profiles?: {
    first_name: string;
    last_name: string;
    username: string;
    avatar_url: string;
  };
  artworks?: {
    title: string;
    image_url: string;
    description: string;
  };
}

interface OpenCallCurationPanelProps {
  openCallId: string;
  numWinners: number;
  onClose: () => void;
}

const OpenCallCurationPanel = ({ openCallId, numWinners, onClose }: OpenCallCurationPanelProps) => {
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [curationNotes, setCurationNotes] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['open-call-submissions', openCallId],
    queryFn: async () => {
      console.log('Fetching submissions for curation:', openCallId);
      
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles(first_name, last_name, username, avatar_url),
          artworks(title, image_url, description)
        `)
        .eq('open_call_id', openCallId)
        .eq('payment_status', 'paid')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }

      return data as Submission[];
    },
  });

  const updateSubmissionSelection = useMutation({
    mutationFn: async ({ submissionId, isSelected, notes }: { submissionId: string; isSelected: boolean; notes?: string }) => {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          is_selected: isSelected,
          curator_notes: notes || null
        })
        .eq('id', submissionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-call-submissions', openCallId] });
      toast({
        title: "Selection Updated",
        description: "Submission selection has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update selection.",
        variant: "destructive",
      });
    },
  });

  const handleSubmissionToggle = (submissionId: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(submissionId)) {
      newSelected.delete(submissionId);
    } else {
      if (newSelected.size < numWinners) {
        newSelected.add(submissionId);
      } else {
        toast({
          title: "Selection Limit Reached",
          description: `You can only select ${numWinners} winner${numWinners > 1 ? 's' : ''}.`,
          variant: "destructive",
        });
        return;
      }
    }
    setSelectedSubmissions(newSelected);
  };

  const handleBulkSelection = () => {
    const topSubmissions = submissions?.slice(0, numWinners).map(s => s.id) || [];
    setSelectedSubmissions(new Set(topSubmissions));
  };

  const saveCuration = async () => {
    const updates = Array.from(selectedSubmissions).map(submissionId => {
      const notes = curationNotes[submissionId];
      return updateSubmissionSelection.mutateAsync({
        submissionId,
        isSelected: true,
        notes
      });
    });

    // Also mark unselected submissions
    const unselectedUpdates = submissions
      ?.filter(s => !selectedSubmissions.has(s.id))
      .map(s => updateSubmissionSelection.mutateAsync({
        submissionId: s.id,
        isSelected: false,
        notes: curationNotes[s.id]
      })) || [];

    try {
      await Promise.all([...updates, ...unselectedUpdates]);
      toast({
        title: "Curation Complete",
        description: `Successfully selected ${selectedSubmissions.size} winner${selectedSubmissions.size > 1 ? 's' : ''}.`,
      });
      onClose();
    } catch (error) {
      console.error('Error saving curation:', error);
    }
  };

  const exportWinnerEmails = () => {
    const winnerEmails = submissions
      ?.filter(s => selectedSubmissions.has(s.id))
      .map(s => `${s.profiles?.first_name} ${s.profiles?.last_name} <${s.profiles?.username}@email.com>`)
      .join('\n');
    
    const blob = new Blob([winnerEmails || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-call-winners-${openCallId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const paidSubmissions = submissions?.filter(s => s.payment_status === 'paid') || [];

  return (
    <div className="space-y-6">
      {/* Curation Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Curation Panel
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {selectedSubmissions.size} / {numWinners} Selected
              </Badge>
              <Badge variant="secondary">
                {paidSubmissions.length} Total Submissions
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleBulkSelection} variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Select Top {numWinners}
            </Button>
            <Button onClick={() => setSelectedSubmissions(new Set())} variant="outline" size="sm">
              <XCircle className="h-4 w-4 mr-2" />
              Clear Selection
            </Button>
            <Button onClick={exportWinnerEmails} variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Export Winner Emails
            </Button>
            <Button onClick={saveCuration} disabled={selectedSubmissions.size === 0} className="ml-auto">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Curation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions for Curation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Artwork</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paidSubmissions.map((submission) => (
                <TableRow key={submission.id} className={selectedSubmissions.has(submission.id) ? 'bg-green-50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSubmissions.has(submission.id)}
                      onCheckedChange={() => handleSubmissionToggle(submission.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={submission.profiles?.avatar_url} />
                        <AvatarFallback>
                          {submission.profiles?.first_name?.[0]}{submission.profiles?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {submission.profiles?.first_name} {submission.profiles?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">@{submission.profiles?.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={submission.artworks?.image_url} 
                        alt={submission.artworks?.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{submission.artworks?.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {submission.artworks?.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(submission.submitted_at).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={submission.is_selected ? 'default' : 'secondary'}>
                      {submission.is_selected ? 'Selected' : 'Not Selected'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Add curator notes..."
                      value={curationNotes[submission.id] || ''}
                      onChange={(e) => setCurationNotes(prev => ({
                        ...prev,
                        [submission.id]: e.target.value
                      }))}
                      className="min-h-[60px] text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenCallCurationPanel;
