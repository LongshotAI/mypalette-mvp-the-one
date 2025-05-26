
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import { useSubmissions } from '@/hooks/useSubmissions';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Users, 
  Plus, 
  Search,
  Filter,
  Award,
  Clock,
  MapPin,
  Star,
  Eye,
  TrendingUp,
  Palette
} from 'lucide-react';

const OpenCalls = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline');

  const { getLiveOpenCalls } = useOpenCalls();
  const { data: openCalls, isLoading } = getLiveOpenCalls;

  const filteredCalls = openCalls?.filter(call => 
    call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedCalls = [...filteredCalls].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.submission_deadline).getTime() - new Date(b.submission_deadline).getTime();
      case 'fee':
        return a.submission_fee - b.submission_fee;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const handleSubmit = (callId: string) => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    navigate(`/submit/${callId}`);
  };

  const handleHostApplication = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    navigate('/host-application');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Open Calls & Opportunities</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover curated opportunities, exhibitions, and collaborations for digital artists
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{openCalls?.length || 0}+</div>
              <div className="text-sm text-muted-foreground">Active Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">$50K+</div>
              <div className="text-sm text-muted-foreground">Total Prizes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2,500+</div>
              <div className="text-sm text-muted-foreground">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Free</div>
              <div className="text-sm text-muted-foreground">First Submission</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => user ? handleSubmit(sortedCalls[0]?.id || '') : navigate('/auth/register')}>
              <Palette className="mr-2 h-5 w-5" />
              Submit Your Art
            </Button>
            <Button variant="outline" size="lg" onClick={handleHostApplication}>
              <Plus className="mr-2 h-5 w-5" />
              Host an Open Call
            </Button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="fee">Submission Fee</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Open Calls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedCalls.map((call, index) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden rounded-t-lg">
                    {call.banner_image ? (
                      <img 
                        src={call.banner_image} 
                        alt={call.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="secondary">
                        {call.organization_name || 'Open Call'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {call.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {call.organization_name || 'Independent Call'}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {call.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Deadline: {new Date(call.submission_deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{call.submission_fee === 0 ? 'Free first submission, $2 additional' : `$${call.submission_fee}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Max {call.max_submissions} submissions</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleSubmit(call.id)}
                  >
                    Submit Your Work
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Open Calls Message */}
        {sortedCalls.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Open Calls Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create an open call!'}
            </p>
            <Button onClick={handleHostApplication}>
              <Plus className="mr-2 h-4 w-4" />
              Host an Open Call
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 py-12 bg-muted/50 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your portfolio and submit to your first open call today. Your first submission is always free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth/register')}>
              Create Your Portfolio
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/discover')}>
              Explore Artist Portfolios
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OpenCalls;
