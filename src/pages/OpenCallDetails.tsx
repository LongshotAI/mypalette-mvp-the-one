
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users, MapPin, Clock, Award, ExternalLink, AlertCircle, ArrowLeft, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SubmissionsList from '@/components/open-calls/SubmissionsList';

const OpenCallDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: adminRole } = useAdminCheck();
  const isAdmin = adminRole === 'admin';

  // Validate UUID format
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const { data: openCall, isLoading, error } = useQuery({
    queryKey: ['open-call', id],
    queryFn: async () => {
      if (!id || !isValidUUID(id)) {
        throw new Error('Invalid open call ID format');
      }

      console.log('Fetching open call details for ID:', id);
      
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(username, first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching open call:', error);
        if (error.code === 'PGRST116') {
          throw new Error('Open call not found');
        }
        throw error;
      }

      console.log('Open call fetched successfully:', data);
      return data;
    },
    enabled: !!id,
  });

  const isHost = user && openCall && openCall.host_user_id === user.id;

  const { data: submissionCount } = useQuery({
    queryKey: ['submission-count', id],
    queryFn: async () => {
      if (!id || !isValidUUID(id)) return 0;

      console.log('Fetching submission count for open call:', id);
      
      const { data, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact' })
        .eq('open_call_id', id)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('Error fetching submission count:', error);
        return 0;
      }

      const count = data?.length || 0;
      console.log('Submission count:', count);
      return count;
    },
    enabled: !!id && isValidUUID(id || ''),
  });

  const handleSubmit = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    if (id && isValidUUID(id)) {
      navigate(`/submit/${id}`);
    } else {
      console.error('Invalid open call ID for submission');
    }
  };

  if (!id || !isValidUUID(id)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invalid open call ID format. Please check the URL.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/open-calls')}>
              Back to Open Calls
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to load open call details'}
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/open-calls')}>
              Back to Open Calls
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!openCall) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Open Call Not Found</h1>
            <p className="text-muted-foreground mb-6">The open call you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/open-calls')}>
              Back to Open Calls
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isExpired = new Date(openCall.submission_deadline) < new Date();
  const daysLeft = Math.ceil((new Date(openCall.submission_deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Back Button - Prominent at top left */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/open-calls')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Open Calls
              </Button>
            </div>
            {/* Header */}
            <Card className="overflow-hidden">
              {(openCall.banner_image || openCall.cover_image) && (
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
                  <img 
                    src={openCall.banner_image || openCall.cover_image} 
                    alt={openCall.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">{openCall.title}</CardTitle>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-muted-foreground">
                        Organized by {openCall.organization_name || openCall.profiles?.first_name}
                      </p>
                      {openCall.logo_image && (
                        <img 
                          src={openCall.logo_image} 
                          alt={`${openCall.organization_name} logo`}
                          className="h-8 w-8 object-cover rounded border"
                        />
                      )}
                    </div>
                    {openCall.organization_website && (
                      <a 
                        href={openCall.organization_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                      >
                        Visit Website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={isExpired ? "destructive" : openCall.status === 'live' ? "default" : "secondary"}>
                      {isExpired ? 'Expired' : openCall.status === 'live' ? 'Live' : openCall.status}
                    </Badge>
                    {openCall.aifilm3_partner && (
                      <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600">
                        <Award className="h-3 w-3 mr-1" />
                        AIFilm3 Partner
                      </Badge>
                    )}
                    {!isExpired && daysLeft <= 7 && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        {daysLeft} days left
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Deadline</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(openCall.submission_deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Submission Fee</p>
                      <p className="text-sm text-muted-foreground">
                        1 free submission, then $2 each (max 6 total)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Submissions</p>
                      <p className="text-sm text-muted-foreground">
                        {submissionCount || 0} / {openCall.max_submissions || 100}
                      </p>
                    </div>
                  </div>
                </div>
                
                {!isExpired && openCall.status === 'live' && (
                  <Button size="lg" className="w-full md:w-auto" onClick={handleSubmit}>
                    Submit Your Work
                  </Button>
                )}
                
                {(isExpired || openCall.status === 'under_curation') && (isHost || isAdmin) && (
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => navigate(`/open-calls/${id}/curate`)}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Curate Submissions
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {openCall.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Prize Information */}
            {openCall.prize_info && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Prize Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {openCall.prize_info}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* About the Host */}
            {openCall.about_host && (
              <Card>
                <CardHeader>
                  <CardTitle>About the Host</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {openCall.about_host}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {openCall.submission_requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {Object.values(openCall.submission_requirements as any).map((req: any, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Submissions Section */}
            <Card>
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <SubmissionsList 
                  openCallId={id!} 
                  openCallTitle={openCall.title}
                  showFilters={true}
                  allowSelection={false}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default OpenCallDetails;
