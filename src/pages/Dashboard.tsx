
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  FileText, 
  Award, 
  Calendar,
  Building2,
  Eye,
  Send
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useHostApplications } from '@/hooks/useHostApplications';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserSubmissions } = useSubmissions();
  const { getUserHostApplications } = useHostApplications();
  
  const { data: submissions, isLoading: submissionsLoading } = getUserSubmissions;
  const { data: hostApplications, isLoading: hostAppsLoading } = getUserHostApplications;

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
              <p className="text-muted-foreground mb-4">
                You need to be logged in to access your dashboard.
              </p>
              <Button asChild>
                <Link to="/auth/login">Log In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your submissions and open call applications
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <Badge variant="outline">
                    {submissions?.length || 0} submissions
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">Your Submissions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your artwork submissions
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link to="/open-calls">
                    <Send className="h-4 w-4 mr-2" />
                    Submit to Open Call
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                  <Badge variant="outline">
                    {hostApplications?.length || 0} applications
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">Host Applications</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your open call hosting requests
                </p>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link to="/host-application">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply to Host
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="h-8 w-8 text-primary" />
                  <Badge variant="outline">Browse</Badge>
                </div>
                <h3 className="font-semibold mb-2">Open Calls</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover new opportunities
                </p>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link to="/open-calls">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Open Calls
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="submissions" className="space-y-6">
              <TabsList>
                <TabsTrigger value="submissions">My Submissions</TabsTrigger>
                <TabsTrigger value="applications">Host Applications</TabsTrigger>
              </TabsList>

              <TabsContent value="submissions">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submissionsLoading ? (
                      <LoadingSpinner />
                    ) : submissions && submissions.length > 0 ? (
                      <div className="space-y-4">
                        {submissions.map((submission) => (
                          <div key={submission.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">
                                {(submission.submission_data as any)?.title || 'Untitled Submission'}
                              </h4>
                              <Badge variant={submission.is_selected ? 'default' : 'outline'}>
                                {submission.is_selected ? 'Selected' : submission.payment_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Open Call: {(submission as any).open_calls?.title || 'Unknown'}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No submissions yet.</p>
                        <p className="text-sm">Start by browsing open calls!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications">
                <Card>
                  <CardHeader>
                    <CardTitle>Host Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hostAppsLoading ? (
                      <LoadingSpinner />
                    ) : hostApplications && hostApplications.length > 0 ? (
                      <div className="space-y-4">
                        {hostApplications.map((application) => (
                          <div key={application.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">
                                {application.proposed_title}
                              </h4>
                              <Badge variant={
                                application.application_status === 'approved' ? 'default' :
                                application.application_status === 'rejected' ? 'destructive' :
                                'outline'
                              }>
                                {application.application_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Organization: {application.organization_name}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              Applied: {new Date(application.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No host applications yet.</p>
                        <p className="text-sm">Apply to host your own open call!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
