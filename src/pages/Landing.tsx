
import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Palette, 
  Users, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Star,
  Eye,
  Heart,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePortfolios } from '@/hooks/usePortfolios';
import { useOpenCalls } from '@/hooks/useOpenCalls';
import { useAIFilm3 } from '@/hooks/useAIFilm3';
import { usePlatformStats } from '@/hooks/usePlatformStats';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Landing = () => {
  const navigate = useNavigate();
  const { featuredPortfoliosQuery } = usePortfolios();
  const { getFeaturedOpenCalls } = useOpenCalls();
  const { getAnnouncements } = useAIFilm3();
  const { data: platformStats, isLoading: statsLoading } = usePlatformStats();

  const featuredPortfolios = featuredPortfoliosQuery.data || [];
  const featuredOpenCalls = getFeaturedOpenCalls.data || [];
  const aiFilm3Announcements = getAnnouncements.data?.slice(0, 3) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 overflow-hidden">
          <motion.div
            className="container mx-auto px-4 text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Showcase Your Digital Art
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Join thousands of digital artists sharing their work, connecting with galleries, 
              and participating in exhibitions worldwide.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Button size="lg" onClick={() => navigate('/discover')}>
                Explore Art
                <Palette className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth/register')}>
                Create Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse" />
        </section>

        {/* Featured Portfolios Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <Star className="h-8 w-8 text-primary" />
                Featured Portfolios
              </h2>
              <p className="text-muted-foreground">Discover exceptional work from our community</p>
            </motion.div>

            {featuredPortfoliosQuery.isLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : featuredPortfolios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredPortfolios.map((portfolio, index) => (
                  <motion.div
                    key={portfolio.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                        {portfolio.cover_image ? (
                          <img
                            src={portfolio.cover_image}
                            alt={portfolio.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Palette className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="default" className="bg-primary/90">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {portfolio.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={portfolio.profiles?.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {portfolio.profiles?.first_name?.[0]}{portfolio.profiles?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {portfolio.view_count || 0} views
                          </div>
                          {portfolio.profiles?.artistic_medium && (
                            <Badge variant="outline" className="text-xs">
                              {portfolio.profiles.artistic_medium}
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/portfolio/${portfolio.slug || portfolio.id}`)}
                        >
                          View Portfolio
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No featured portfolios available yet.</p>
              </div>
            )}

            <div className="text-center">
              <Button variant="outline" onClick={() => navigate('/discover')}>
                View All Portfolios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Open Calls Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <Calendar className="h-8 w-8 text-primary" />
                Featured Open Calls
              </h2>
              <p className="text-muted-foreground">Exciting opportunities for artists to showcase their work</p>
            </motion.div>

            {getFeaturedOpenCalls.isLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : featuredOpenCalls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredOpenCalls.slice(0, 3).map((openCall, index) => (
                  <motion.div
                    key={openCall.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {openCall.title}
                          </CardTitle>
                          <Badge variant="default">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                        {openCall.organization_name && (
                          <p className="text-sm text-muted-foreground">{openCall.organization_name}</p>
                        )}
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {openCall.description}
                        </p>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Deadline:</span>
                            <span className="font-medium">
                              {format(new Date(openCall.submission_deadline), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fee:</span>
                            <span className="font-medium">
                              {openCall.submission_fee === 0 ? 'Free' : `$${openCall.submission_fee}`}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/open-calls/${openCall.id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No featured open calls available yet.</p>
              </div>
            )}

            <div className="text-center">
              <Button variant="outline" onClick={() => navigate('/open-calls')}>
                View All Open Calls
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* AIFilm3 Announcements Section */}
        {aiFilm3Announcements.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                  🎬 AIFilm3 Festival Updates
                </h2>
                <p className="text-muted-foreground">Latest news from the AI Film Festival</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {aiFilm3Announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">
                            {announcement.title}
                          </CardTitle>
                          <Badge variant="outline">
                            Festival
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                        </p>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm line-clamp-4">
                          {announcement.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" onClick={() => navigate('/aifilm3/announcements')}>
                  View All Updates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Platform Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
              <p className="text-muted-foreground">Real-time statistics from our platform</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div className="text-center" variants={itemVariants}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {statsLoading ? '...' : platformStats?.totalUsers || 0}
                </h3>
                <p className="text-lg font-medium mb-2">Registered Artists</p>
                <p className="text-muted-foreground">
                  Join our growing community of digital artists
                </p>
              </motion.div>

              <motion.div className="text-center" variants={itemVariants}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {statsLoading ? '...' : platformStats?.totalPortfolios || 0}
                </h3>
                <p className="text-lg font-medium mb-2">Active Portfolios</p>
                <p className="text-muted-foreground">
                  Professional portfolios showcasing amazing work
                </p>
              </motion.div>

              <motion.div className="text-center" variants={itemVariants}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {statsLoading ? '...' : platformStats?.totalOpenCalls || 0}
                </h3>
                <p className="text-lg font-medium mb-2">Current Open Calls</p>
                <p className="text-muted-foreground">
                  Live opportunities for exhibitions and showcases
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground">
          <motion.div
            className="container mx-auto px-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Art?</h2>
            <p className="text-xl mb-8 opacity-90">
              Create your professional portfolio and connect with the global art community today.
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth/register')}>
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default Landing;
