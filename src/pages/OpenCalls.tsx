
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  ExternalLink, 
  Search,
  Filter,
  Clock,
  Building,
  Star
} from 'lucide-react';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const OpenCalls = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'featured'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'created' | 'fee'>('deadline');
  
  const { getOpenCalls, getFeaturedOpenCalls } = useOpenCalls();
  
  // Get the appropriate data based on filter
  const openCallsQuery = statusFilter === 'featured' ? getFeaturedOpenCalls : getOpenCalls;
  const openCalls = openCallsQuery.data || [];

  // Filter and sort open calls
  const filteredCalls = openCalls
    .filter(call => {
      const matchesSearch = 
        call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.submission_deadline).getTime() - new Date(b.submission_deadline).getTime();
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'fee':
          return a.submission_fee - b.submission_fee;
        default:
          return 0;
      }
    });

  const getDaysUntilDeadline = (deadline: string) => {
    return differenceInDays(new Date(deadline), new Date());
  };

  const getDeadlineBadge = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return { variant: 'destructive' as const, text: 'Expired' };
    if (days === 0) return { variant: 'destructive' as const, text: 'Today' };
    if (days <= 7) return { variant: 'secondary' as const, text: `${days} days left` };
    return { variant: 'outline' as const, text: `${days} days left` };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Open Calls for Artists</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover exciting opportunities to showcase your work and connect with galleries, 
            museums, and organizations worldwide.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search open calls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Open Calls</SelectItem>
                  <SelectItem value="live">Live Calls</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">By Deadline</SelectItem>
                  <SelectItem value="created">Recently Added</SelectItem>
                  <SelectItem value="fee">By Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{openCalls.length} open calls available</span>
            <span>•</span>
            <span>{openCalls.filter(call => call.submission_fee === 0).length} free submissions</span>
            <span>•</span>
            <span>{openCalls.filter(call => getDaysUntilDeadline(call.submission_deadline) <= 7).length} ending soon</span>
          </div>
        </motion.div>

        {/* Open Calls Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {openCallsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredCalls.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Open Calls Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria or filters.' 
                    : 'Check back soon for new opportunities to showcase your work.'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCalls.map((openCall) => {
                const deadlineBadge = getDeadlineBadge(openCall.submission_deadline);
                
                return (
                  <motion.div
                    key={openCall.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                              {openCall.title}
                            </CardTitle>
                            {openCall.organization_name && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <Building className="h-3 w-3" />
                                {openCall.organization_name}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-1 items-end">
                            <Badge variant={deadlineBadge.variant}>
                              <Clock className="h-3 w-3 mr-1" />
                              {deadlineBadge.text}
                            </Badge>
                            {/* Temporarily removed featured badge until we implement the featured system */}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {openCall.description}
                        </p>

                        {/* Key Details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Deadline
                            </div>
                            <span className="font-medium">
                              {format(new Date(openCall.submission_deadline), 'MMM d, yyyy')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              Submission Fee
                            </div>
                            <span className="font-medium">
                              {openCall.submission_fee === 0 ? 'Free' : `$${openCall.submission_fee}`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              Max Submissions
                            </div>
                            <span className="font-medium">{openCall.max_submissions}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            className="flex-1"
                            onClick={() => navigate(`/open-calls/${openCall.id}`)}
                          >
                            View Details
                          </Button>
                          {openCall.organization_website && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <a 
                                href={openCall.organization_website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-2">Looking to Host an Open Call?</h3>
              <p className="text-muted-foreground mb-4">
                Connect with talented artists and curate amazing exhibitions through our platform.
              </p>
              <Button onClick={() => navigate('/host-application')}>
                Apply to Host
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OpenCalls;
