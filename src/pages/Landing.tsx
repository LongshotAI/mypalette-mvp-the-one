
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Users, 
  Palette, 
  Trophy, 
  Star,
  ExternalLink,
  Eye,
  Calendar,
  DollarSign,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useFeaturedContent } from '@/hooks/useFeaturedContent';
import { usePlatformStats } from '@/hooks/usePlatformStats';
import { format, differenceInDays } from 'date-fns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Landing = () => {
  const navigate = useNavigate();
  const { getFeaturedPortfolios, getFeaturedOpenCalls } = useFeaturedContent();
  const { data: platformStats } = usePlatformStats();

  const featuredPortfolios = getFeaturedPortfolios.data || [];
  const featuredOpenCalls = getFeaturedOpenCalls.data || [];

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Art, Your Story
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Connect with galleries, showcase your portfolio, and discover opportunities in the digital art world.
            </p>
            
            {/* Platform Statistics */}
            {platformStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{platformStats.totalArtists}+</div>
                  <div className="text-sm text-muted-foreground">Artists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{platformStats.totalPortfolios}+</div>
                  <div className="text-sm text-muted-foreground">Portfolios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{platformStats.activeOpenCalls}</div>
                  <div className="text-sm text-muted-foreground">Open Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{platformStats.totalArtworks}+</div>
                  <div className="text-sm text-muted-foreground">Artworks</div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/discover')}
                className="text-lg px-8 py-6"
              >
                <Palette className="mr-2 h-5 w-5" />
                Explore Art
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/auth/register')}
                className="text-lg px-8 py-6"
              >
                <Users className="mr-2 h-5 w-5" />
                Create Portfolio
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Portfolios Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Artists</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover exceptional work from our community of talented artists
            </p>
          </motion.div>

          {getFeaturedPortfolios.isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : featuredPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPortfolios.slice(0, 6).map((featured, index) => {
                const portfolio = featured.portfolios;
                if (!portfolio) return null;

                return (
                  <motion.div
                    key={featured.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      {portfolio.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={portfolio.cover_image} 
                            alt={portfolio.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                              {portfolio.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              by {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {portfolio.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            {portfolio.view_count} views
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/portfolio/${portfolio.slug}`)}
                          >
                            View Portfolio
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Featured Portfolios Yet</h3>
              <p className="text-muted-foreground">Featured portfolios will appear here once admins select them.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Open Calls Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Opportunities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover exciting open calls and exhibitions to showcase your work
            </p>
          </motion.div>

          {getFeaturedOpenCalls.isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : featuredOpenCalls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredOpenCalls.slice(0, 6).map((featured, index) => {
                const openCall = featured.open_calls;
                if (!openCall) return null;

                const deadlineBadge = getDeadlineBadge(openCall.submission_deadline);

                return (
                  <motion.div
                    key={featured.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                      {openCall.banner_image && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={openCall.banner_image} 
                            alt={openCall.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
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
                            <Badge variant="secondary">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                            <Badge variant={deadlineBadge.variant}>
                              {deadlineBadge.text}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {openCall.description}
                        </p>

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
                              Fee
                            </div>
                            <span className="font-medium">
                              {openCall.submission_fee === 0 ? 'Free' : `$${openCall.submission_fee}`}
                            </span>
                          </div>

                          {openCall.number_of_winners && (
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Trophy className="h-4 w-4" />
                                Winners
                              </div>
                              <span className="font-medium">{openCall.number_of_winners}</span>
                            </div>
                          )}
                        </div>

                        <Button 
                          className="w-full"
                          onClick={() => navigate(`/open-calls/${openCall.id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Featured Open Calls Yet</h3>
              <p className="text-muted-foreground">Featured opportunities will appear here once admins select them.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Share Your Art with the World?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of artists showcasing their work, connecting with galleries, 
              and participating in exciting opportunities on MyPalette.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth/register')}
              className="text-lg px-8 py-6"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <div className="space-y-2">
                <a href="/discover" className="block text-muted-foreground hover:text-primary transition-colors">
                  Discover Art
                </a>
                <a href="/open-calls" className="block text-muted-foreground hover:text-primary transition-colors">
                  Open Calls
                </a>
                <a href="/education" className="block text-muted-foreground hover:text-primary transition-colors">
                  Learn
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Artists</h3>
              <div className="space-y-2">
                <a href="/auth/register" className="block text-muted-foreground hover:text-primary transition-colors">
                  Create Portfolio
                </a>
                <a href="/dashboard" className="block text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </a>
                <a href="/host-application" className="block text-muted-foreground hover:text-primary transition-colors">
                  Host an Open Call
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2">
                <a 
                  href="https://pixelpalette.co/blog" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
                <a href="/aifilm3/info" className="block text-muted-foreground hover:text-primary transition-colors">
                  AIFilm3 Festival
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-2">
                <a 
                  href="https://twitter.com/pixelpalette" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Twitter <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
                <a 
                  href="https://instagram.com/pixelpalette" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Instagram <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
                <a 
                  href="https://discord.gg/pixelpalette" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Discord <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
