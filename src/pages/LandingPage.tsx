
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Palette, 
  Users, 
  Trophy, 
  Briefcase, 
  ArrowRight, 
  Star,
  Image,
  Zap,
  Globe
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Palette,
      title: "Digital Art Portfolio",
      description: "Create stunning portfolios to showcase your digital artwork to the world"
    },
    {
      icon: Briefcase,
      title: "Open Call Opportunities",
      description: "Discover and submit to curated art opportunities and exhibitions"
    },
    {
      icon: Users,
      title: "Artist Community",
      description: "Connect with fellow digital artists and build your network"
    },
    {
      icon: Trophy,
      title: "Competitions & Prizes",
      description: "Participate in art competitions and win recognition and prizes"
    }
  ];

  const stats = [
    { label: "Active Artists", value: "2,500+" },
    { label: "Open Calls", value: "150+" },
    { label: "Total Prizes", value: "$50K+" },
    { label: "Countries", value: "75+" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Palette className="h-16 w-16 text-primary mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MyPalette
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              The premier platform for digital artists to showcase, compete, and connect
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/dashboard')}
                    className="text-lg px-8 py-3"
                  >
                    <Image className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => navigate('/open-calls')}
                    className="text-lg px-8 py-3"
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Browse Open Calls
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth/register')}
                    className="text-lg px-8 py-3"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Creating
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => navigate('/open-calls')}
                    className="text-lg px-8 py-3"
                  >
                    <Globe className="mr-2 h-5 w-5" />
                    Explore Platform
                  </Button>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need as a Digital Artist
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From portfolio creation to competition entry, MyPalette provides all the tools you need to succeed in the digital art world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join the Community?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Start building your digital art career today. Join thousands of artists who trust MyPalette for their creative journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate(user ? '/dashboard' : '/auth/register')}
                className="text-lg px-8 py-3"
              >
                {user ? 'Go to Dashboard' : 'Create Account'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/open-calls')}
                className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Browse Opportunities
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
