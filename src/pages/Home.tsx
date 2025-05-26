
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Users, Briefcase, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Palette,
      title: 'Create Portfolios',
      description: 'Showcase your artwork with beautiful, customizable portfolios',
      action: () => navigate('/my-portfolios'),
      color: 'bg-blue-500'
    },
    {
      icon: Briefcase,
      title: 'Open Calls',
      description: 'Find opportunities and submit your work to exhibitions',
      action: () => navigate('/open-calls'),
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Discover Artists',
      description: 'Connect with talented artists from around the world',
      action: () => navigate('/discover'),
      color: 'bg-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Career',
      description: 'Access resources and tools to advance your artistic journey',
      action: () => navigate('/education'),
      color: 'bg-orange-500'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to MyPalette
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The ultimate platform for digital artists to showcase their work, discover opportunities, and connect with the creative community.
          </p>
          
          {!user ? (
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth/register')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth/login')}>
                Sign In
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/my-portfolios')}>
                My Portfolios
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/discover')}>
                Discover Artists
              </Button>
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 3) }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full" onClick={feature.action}>
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 ${feature.color} rounded-lg flex items-center justify-center`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                  <ArrowRight className="h-4 w-4 mx-auto text-primary" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Join Our Growing Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-muted-foreground">Active Artists</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Portfolios Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Open Calls</div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Home;
