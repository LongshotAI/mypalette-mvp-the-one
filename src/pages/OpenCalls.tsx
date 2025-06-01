
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Users, Building2, Plus } from 'lucide-react';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const OpenCalls = () => {
  const { getOpenCalls } = useOpenCalls();
  const { data: openCalls, isLoading } = getOpenCalls;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Open Calls</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Discover opportunities to showcase your art
            </p>
            
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link to="/host-application">
                  <Plus className="h-4 w-4 mr-2" />
                  Host an Open Call
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Open Calls Grid */}
          {openCalls && openCalls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openCalls.map((openCall, index) => (
                <motion.div
                  key={openCall.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {openCall.banner_image && (
                      <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={openCall.banner_image}
                          alt={openCall.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">
                          {openCall.status}
                        </Badge>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {openCall.submission_fee > 0 ? `$${openCall.submission_fee}` : 'Free'}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{openCall.title}</CardTitle>
                      {openCall.organization_name && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4 mr-1" />
                          {openCall.organization_name}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {openCall.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="font-medium">Deadline:</span>
                          <span className="ml-2">
                            {new Date(openCall.submission_deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="font-medium">Max Submissions:</span>
                          <span className="ml-2">{openCall.max_submissions}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link to={`/open-calls/${openCall.id}`}>
                            View Details
                          </Link>
                        </Button>
                        {openCall.status === 'live' && (
                          <Button asChild variant="outline">
                            <Link to={`/submit/${openCall.id}`}>
                              Submit
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Open Calls Available</h3>
              <p className="text-muted-foreground mb-6">
                There are currently no live open calls. Check back soon or consider hosting your own!
              </p>
              <Button asChild>
                <Link to="/host-application">
                  <Plus className="h-4 w-4 mr-2" />
                  Host an Open Call
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OpenCalls;
