
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  ArrowLeft, 
  Send, 
  Building2,
  Clock,
  Award
} from 'lucide-react';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const OpenCallDetails = () => {
  const { callId } = useParams();
  const { getOpenCallById } = useOpenCalls();
  const { data: openCall, isLoading } = getOpenCallById(callId || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!openCall) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Open Call Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The open call you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/open-calls">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Open Calls
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isDeadlinePassed = new Date(openCall.submission_deadline) < new Date();
  const canSubmit = !isDeadlinePassed && openCall.status === 'live';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            asChild
            className="mb-6"
          >
            <Link to="/open-calls">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Calls
            </Link>
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {openCall.banner_image && (
              <div className="h-64 bg-gray-200 rounded-lg overflow-hidden mb-6">
                <img
                  src={openCall.banner_image}
                  alt={openCall.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  {openCall.status}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{openCall.title}</h1>
                {openCall.organization_name && (
                  <div className="flex items-center text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>{openCall.organization_name}</span>
                  </div>
                )}
              </div>
              
              {canSubmit && (
                <Button asChild size="lg">
                  <Link to={`/submit/${openCall.id}`}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Artwork
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>About This Open Call</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {openCall.description}
                  </p>
                </CardContent>
              </Card>

              {openCall.submission_requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      {typeof openCall.submission_requirements === 'object' && 
                        Object.entries(openCall.submission_requirements).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))
                      }
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Key Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Deadline</span>
                    </div>
                    <span className="text-sm">
                      {new Date(openCall.submission_deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Fee</span>
                    </div>
                    <span className="text-sm">
                      {openCall.submission_fee > 0 ? `$${openCall.submission_fee}` : 'Free'}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Max Submissions</span>
                    </div>
                    <span className="text-sm">{openCall.max_submissions}</span>
                  </div>

                  {isDeadlinePassed && (
                    <>
                      <Separator />
                      <div className="flex items-center text-red-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Deadline Passed</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {openCall.organization_website && (
                <Card>
                  <CardHeader>
                    <CardTitle>Host Organization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{openCall.organization_name}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={openCall.organization_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpenCallDetails;
