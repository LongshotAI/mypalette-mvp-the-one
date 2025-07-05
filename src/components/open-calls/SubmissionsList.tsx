import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, Filter, Award, Calendar, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionData } from '@/types/submission';
import { convertToSubmissionData } from '@/utils/typeGuards';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface SubmissionsListProps {
  openCallId: string;
  openCallTitle?: string;
  showFilters?: boolean;
  allowSelection?: boolean; // For curation mode
  onSelectionChange?: (selectedIds: string[]) => void;
}

const SubmissionsList = ({ 
  openCallId, 
  openCallTitle, 
  showFilters = true,
  allowSelection = false,
  onSelectionChange 
}: SubmissionsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  const { user } = useAuth();
  const { data: adminRole } = useAdminCheck();
  const isAdmin = adminRole === 'admin';

  // Check if user is host of this open call
  const { data: openCall } = useQuery({
    queryKey: ['open-call-host-check', openCallId],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('open_calls')
        .select('host_user_id')
        .eq('id', openCallId)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!user && !!openCallId,
  });

  const isHost = user && openCall?.host_user_id === user.id;
  const canViewPaymentStatus = isAdmin || isHost || allowSelection; // Curation mode also needs payment status

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions-list', openCallId],
    queryFn: async (): Promise<Submission[]> => {
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
    enabled: !!openCallId,
  });

  const filteredSubmissions = submissions?.filter(submission => {
    const submissionData = submission.submission_data || {} as SubmissionData;
    const matchesSearch = 
      submissionData.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submissionData.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'selected' && submission.is_selected) ||
      (statusFilter === 'pending' && !submission.is_selected) ||
      (statusFilter === 'paid' && submission.payment_status === 'paid') ||
      (statusFilter === 'free' && submission.payment_status === 'free');
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleSelectionToggle = (submissionId: string) => {
    if (!allowSelection) return;
    
    const newSelected = selectedSubmissions.includes(submissionId)
      ? selectedSubmissions.filter(id => id !== submissionId)
      : [...selectedSubmissions, submissionId];
    
    setSelectedSubmissions(newSelected);
    onSelectionChange?.(newSelected);
  };

  const getSubmissionData = (submission: Submission): SubmissionData => {
    return submission.submission_data || {
      title: '',
      description: '',
      medium: '',
      year: '',
      dimensions: '',
      artist_statement: '',
      image_urls: [],
      external_links: []
    };
  };

  const getStatusColor = (submission: Submission) => {
    if (submission.is_selected) return 'bg-green-500';
    if (submission.payment_status === 'paid') return 'bg-blue-500';
    if (submission.payment_status === 'free') return 'bg-purple-500';
    return 'bg-gray-500';
  };

  const stats = {
    total: submissions?.length || 0,
    selected: submissions?.filter(s => s.is_selected).length || 0,
    paid: submissions?.filter(s => s.payment_status === 'paid').length || 0,
    free: submissions?.filter(s => s.payment_status === 'free').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {openCallTitle ? `Submissions for "${openCallTitle}"` : 'Submissions'}
        </h2>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">Total: {stats.total}</Badge>
          <Badge className="bg-green-500">Selected: {stats.selected}</Badge>
          {canViewPaymentStatus && (
            <>
              <Badge className="bg-blue-500">Paid: {stats.paid}</Badge>
              <Badge className="bg-purple-500">Free: {stats.free}</Badge>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Submissions</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  {canViewPaymentStatus && (
                    <>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions Grid */}
      <div className="grid gap-6">
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Submissions Yet</h3>
              <p className="text-muted-foreground">
                {submissions?.length === 0 
                  ? "This open call hasn't received any submissions yet."
                  : "No submissions match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubmissions.map((submission, index) => {
            const submissionData = getSubmissionData(submission);
            const isSelected = selectedSubmissions.includes(submission.id);
            
            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-all ${
                  submission.is_selected ? 'ring-2 ring-green-500' : ''
                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {allowSelection && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectionToggle(submission.id)}
                              className="w-4 h-4"
                            />
                          )}
                          {submissionData.title || 'Untitled Submission'}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          by {submission.profiles?.first_name || 'Unknown'} {submission.profiles?.last_name || ''}
                          {submission.profiles?.username && ` (@${submission.profiles.username})`}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {submission.is_selected && (
                          <Badge className="bg-green-500">
                            <Award className="h-3 w-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                        {canViewPaymentStatus && (
                          <Badge className={getStatusColor(submission)}>
                            {submission.payment_status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {submissionData.description || 'No description provided'}
                      </p>
                      {submissionData.medium && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Medium: {submissionData.medium}
                        </p>
                      )}
                    </div>

                    {/* Image Preview */}
                    {submissionData.image_urls && submissionData.image_urls.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {submissionData.image_urls.slice(0, 4).map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Artwork ${idx + 1}`}
                            className="w-full h-16 object-cover rounded border"
                          />
                        ))}
                        {submissionData.image_urls.length > 4 && (
                          <div className="w-full h-16 bg-muted rounded border flex items-center justify-center text-xs">
                            +{submissionData.image_urls.length - 4} more
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {submissionData.title || 'Untitled Submission'}
                            </DialogTitle>
                          </DialogHeader>
                          
                          {selectedSubmission && (
                            <div className="space-y-6">
                              {/* Artist Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Artist Information</h4>
                                  <p className="text-sm">
                                    <strong>Name:</strong> {selectedSubmission.profiles?.first_name} {selectedSubmission.profiles?.last_name}
                                  </p>
                                  {selectedSubmission.profiles?.username && (
                                    <p className="text-sm">
                                      <strong>Username:</strong> @{selectedSubmission.profiles.username}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Submission Details</h4>
                                  {canViewPaymentStatus && (
                                    <p className="text-sm">
                                      <strong>Status:</strong> {selectedSubmission.payment_status}
                                    </p>
                                  )}
                                  <p className="text-sm">
                                    <strong>Medium:</strong> {getSubmissionData(selectedSubmission).medium}
                                  </p>
                                  {getSubmissionData(selectedSubmission).year && (
                                    <p className="text-sm">
                                      <strong>Year:</strong> {getSubmissionData(selectedSubmission).year}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Artwork Images */}
                              {getSubmissionData(selectedSubmission).image_urls && getSubmissionData(selectedSubmission).image_urls!.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Artwork Images</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    {getSubmissionData(selectedSubmission).image_urls!.map((url, idx) => (
                                      <img
                                        key={idx}
                                        src={url}
                                        alt={`Artwork ${idx + 1}`}
                                        className="w-full h-48 object-cover rounded border"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Description */}
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">
                                  {getSubmissionData(selectedSubmission).description || 'No description provided'}
                                </p>
                              </div>

                              {/* Artist Statement */}
                              {getSubmissionData(selectedSubmission).artist_statement && (
                                <div>
                                  <h4 className="font-semibold mb-2">Artist Statement</h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {getSubmissionData(selectedSubmission).artist_statement}
                                  </p>
                                </div>
                              )}

                              {/* External Links */}
                              {getSubmissionData(selectedSubmission).external_links && getSubmissionData(selectedSubmission).external_links!.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Additional Links</h4>
                                  <div className="space-y-1">
                                    {getSubmissionData(selectedSubmission).external_links!.map((link, idx) => (
                                      <a
                                        key={idx}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-blue-600 hover:underline"
                                      >
                                        {link}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubmissionsList;