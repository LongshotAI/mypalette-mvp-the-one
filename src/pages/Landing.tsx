import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Eye, Heart, Palette, Users, Briefcase, BookOpen, ArrowRight, Star } from 'lucide-react';

interface FeaturedPortfolio {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image: string;
  view_count: number;
  user_id: string;
  profiles: {
    username: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    artistic_medium: string;
  };
}

const Landing = () => {
  const navigate = useNavigate();
  const [featuredPortfolios, setFeaturedPortfolios] = useState<FeaturedPortfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPortfolios = async () => {
      try {
        // For now, we'll use mock data since the database tables don't exist yet
        const mockPortfolios: FeaturedPortfolio[] = [
          {
            id: '1',
            title: 'Digital Dreams',
            description: 'A collection of surreal digital artwork',
            slug: 'digital-dreams',
            cover_image: '',
            view_count: 1250,
            user_id: '1',
            profiles: {
              username: 'artist1',
              first_name: 'Sarah',
              last_name: 'Johnson',
              avatar_url: '',
              artistic_medium: 'Digital Art'
            }
          },
          {
            id: '2',
            title: 'Abstract Expressions',
            description: 'Bold and vibrant abstract compositions',
            slug: 'abstract-expressions',
            cover_image: '',
            view_count: 980,
            user_id: '2',
            profiles: {
              username: 'artist2',
              first_name: 'Mike',
              last_name: 'Chen',
              avatar_url: '',
              artistic_medium: 'Mixed Media'
            }
          },
          {
            id: '3',
            title: 'Urban Photography',
            description: 'Street photography capturing city life',
            slug: 'urban-photography',
            cover_image: '',
            view_count: 2100,
            user_id: '3',
            profiles: {
              username: 'artist3',
              first_name: 'Emma',
              last_name: 'Rodriguez',
              avatar_url: '',
              artistic_medium: 'Photography'
            }
          }
        ];
        
        setFeaturedPortfolios(mockPortfolios);
      } catch (error) {
        console.error('Error fetching featured portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPortfolios();
  }, []);

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/17ab5ff7-92d6-4e07-ba7a-67585c399503.png" 
                alt="MyPalette Logo" 
                className="h-16 w-auto mr-4"
              />
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
                MyPalette
              </h1>
            </div>
            
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-6">
              Showcase Your Art, Discover Opportunities
            </h2>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The premier platform for digital artists to build stunning portfolios, 
              connect with opportunities, and grow their creative careers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/auth/register')}
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/discover')}
              >
                Explore Portfolios
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>10,000+ Artists</span>
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>50,000+ Artworks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>500+ Opportunities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Portfolios */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">Featured Artists</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover exceptional work from our community of talented digital artists
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredPortfolios.map((portfolio) => (
                <motion.div key={portfolio.id} variants={itemVariants}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden">
                      {portfolio.cover_image ? (
                        <img
                          src={portfolio.cover_image}
                          alt={portfolio.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Palette className="h-12 w-12 text-primary/60" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-white">
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                          <Eye className="h-3 w-3" />
                          <span className="text-xs">{portfolio.view_count}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          {portfolio.profiles.avatar_url ? (
                            <img
                              src={portfolio.profiles.avatar_url}
                              alt="Artist"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {portfolio.profiles.first_name?.[0] || portfolio.profiles.username?.[0] || 'A'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {portfolio.profiles.first_name && portfolio.profiles.last_name
                              ? `${portfolio.profiles.first_name} ${portfolio.profiles.last_name}`
                              : portfolio.profiles.username || 'Artist'}
                          </p>
                          {portfolio.profiles.artistic_medium && (
                            <p className="text-xs text-muted-foreground">
                              {portfolio.profiles.artistic_medium}
                            </p>
                          )}
                        </div>
                      </div>
                      <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {portfolio.title}
                      </h4>
                      {portfolio.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {portfolio.description}
                        </p>
                      )}
                      <Link
                        to={`/portfolio/${portfolio.slug}`}
                        className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        View Portfolio
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/discover')}
            >
              Discover More Artists
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tools and features designed specifically for digital artists
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500/20 to-red-500/40 rounded-2xl flex items-center justify-center">
                  <Palette className="h-8 w-8 text-red-500" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Portfolio Builder</h4>
                <p className="text-muted-foreground">
                  Create stunning portfolios with our premium templates and customization options.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-green-500/40 rounded-2xl flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Open Calls</h4>
                <p className="text-muted-foreground">
                  Discover and submit to curated opportunities, exhibitions, and collaborations.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-blue-500/40 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Education Hub</h4>
                <p className="text-muted-foreground">
                  Learn from industry experts with tutorials, guides, and career advice.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12"
          >
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Showcase Your Art?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of artists who are already building their careers on MyPalette
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/auth/register')}
            >
              Create Your Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
