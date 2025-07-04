
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Users, 
  Calendar, 
  Star, 
  Award,
  Palette,
  Eye,
  ExternalLink,
  Building
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePlatformStats } from '@/hooks/usePlatformStats';

const Landing = () => {
  const navigate = useNavigate();
  const { data: stats } = usePlatformStats();

  // Featured portfolios query
  const { data: featuredPortfolios } = useQuery({
    queryKey: ['featured-portfolios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles(first_name, last_name, username, avatar_url)
        `)
        .eq('is_public', true)
        .eq('is_featured', true)
        .limit(3);

      if (error) throw error;
      return data || [];
    },
  });

  // Featured open calls query
  const { data: featuredOpenCalls } = useQuery({
    queryKey: ['featured-open-calls-landing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(first_name, last_name, username, avatar_url)
        `)
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                MyPalette
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/discovery')}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Explore Art
              </Button>
              <Button 
                onClick={() => navigate('/auth/signup')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Create Portfolio
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Showcase Your Art
              </span>
              <br />
              <span className="text-slate-800">To The World</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
              Create stunning portfolios, participate in curated open calls, and connect with a global community of artists and collectors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 rounded-full"
                onClick={() => navigate('/auth/signup')}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 rounded-full"
                onClick={() => navigate('/discovery')}
              >
                Explore Portfolios
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-slate-600">
              Thousands of artists worldwide trust MyPalette to showcase their work
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">
                    {stats?.totalUsers.toLocaleString() || '0'}
                  </h3>
                  <p className="text-slate-600">Registered Artists</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">
                    {stats?.totalPortfolios.toLocaleString() || '0'}
                  </h3>
                  <p className="text-slate-600">Active Portfolios</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">
                    {stats?.totalOpenCalls.toLocaleString() || '0'}
                  </h3>
                  <p className="text-slate-600">Open Calls</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Portfolios */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Featured Portfolios
            </h2>
            <p className="text-lg text-slate-600">
              Discover exceptional work from our talented community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPortfolios?.map((portfolio, index) => (
              <motion.div
                key={portfolio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden rounded-t-lg">
                    {portfolio.cover_image ? (
                      <img 
                        src={portfolio.cover_image} 
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-slate-800">Featured</Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {portfolio.title}
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                      by {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    {portfolio.description && (
                      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                        {portfolio.description}
                      </p>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                      onClick={() => navigate(`/portfolio/${portfolio.slug}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Portfolio
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Open Calls */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Current Open Calls
            </h2>
            <p className="text-lg text-slate-600">
              Exciting opportunities to showcase your work and win prizes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredOpenCalls?.map((openCall, index) => (
              <motion.div
                key={openCall.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-blue-500/10 relative overflow-hidden rounded-t-lg">
                    {openCall.cover_image ? (
                      <img 
                        src={openCall.cover_image} 
                        alt={openCall.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="h-12 w-12 text-primary" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-green-500 text-white">Live</Badge>
                      {openCall.aifilm3_partner && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          AIFilm3
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {openCall.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building className="h-4 w-4" />
                      {openCall.organization_name}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                      {openCall.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Deadline:</span>
                        <span className="font-medium">
                          {new Date(openCall.submission_deadline).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Fee:</span>
                        <span className="font-medium">
                          {openCall.submission_fee === 0 ? 'Free' : `$${openCall.submission_fee}`}
                        </span>
                      </div>
                      
                      {openCall.prize_info && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Prize:</span>
                          <span className="font-medium line-clamp-1">
                            {openCall.prize_info}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                      onClick={() => navigate(`/open-calls/${openCall.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center mt-12"
          >
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/open-calls')}
              className="px-8 py-4"
            >
              View All Open Calls
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Professional tools and features designed specifically for artists and creative professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Beautiful Portfolios</h3>
                  <p className="text-slate-600">
                    Create stunning, professional portfolios with our easy-to-use templates and customization options.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Curated Opportunities</h3>
                  <p className="text-slate-600">
                    Participate in prestigious open calls and competitions curated by galleries, museums, and organizations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Global Community</h3>
                  <p className="text-slate-600">
                    Connect with artists, collectors, and art professionals from around the world in our vibrant community.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Showcase Your Art?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of artists who trust MyPalette to present their work professionally and connect with opportunities worldwide.
            </p>
            
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-12 py-4 rounded-full font-semibold"
              onClick={() => navigate('/auth/signup')}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">MyPalette</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The professional platform for artists to showcase their work, participate in curated opportunities, and connect with the global art community.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => navigate('/discovery')}
                    className="hover:text-white transition-colors"
                  >
                    Explore Art
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/open-calls')}
                    className="hover:text-white transition-colors"
                  >
                    Open Calls
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/host-application')}
                    className="hover:text-white transition-colors"
                  >
                    Host an Event
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => navigate('/auth/signup')}
                    className="hover:text-white transition-colors"
                  >
                    Create Account
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/auth/login')}
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 MyPalette. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
