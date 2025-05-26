
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, DollarSign, Building2, Globe, Users } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const OpenCallDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: openCall, isLoading, error } = useQuery({
    queryKey: ['open-call', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(username, first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !openCall) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Open Call Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The open call you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/open-calls')}>
                Back to Open Calls
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'default';
      case 'pending': return 'outline';
      case 'approved': return 'secondary';
      case 'closed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/open-calls')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Open Calls
          </Button>

          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{openCall.title}</CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{openCall.organization_name}</span>
                    </div>
                    {openCall.organization_website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={openCall.organization_website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={getStatusColor(openCall.status)}>
                  {openCall.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {openCall.description}
              </p>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Deadline</label>
                  <p className="text-lg font-semibold">
                    {new Date(openCall.submission_deadline).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submission Fee</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      {openCall.submission_fee === 0 ? 'Free' : `$${openCall.submission_fee}`}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Max Submissions</label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-lg font-semibold">{openCall.max_submissions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {openCall.submission_requirements ? (
                  <div className="space-y-2">
                    {Object.entries(openCall.submission_requirements as any).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-sm font-medium text-muted-foreground capitalize">
                          {key.replace('_', ' ')}:
                        </span>
                        <p className="text-sm">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specific requirements listed.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          {openCall.status === 'live' && (
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => navigate(`/submit/${openCall.id}`)}
                className="px-8 py-3"
              >
                Submit Your Artwork
              </Button>
            </div>
          )}

          {openCall.status === 'pending' && (
            <div className="text-center">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">
                    This open call is pending approval and not yet accepting submissions.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OpenCallDetail;
