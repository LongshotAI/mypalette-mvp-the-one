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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  // Mock data for active open calls
  const mockOpenCalls = [
    {
      id: '1',
      title: 'Digital Futures Art Exhibition',
      organization: 'Modern Art Gallery NYC',
      description: 'Seeking innovative digital artworks that explore the intersection of technology and human experience.',
      deadline: '2024-03-15',
      submissionFee: 'Free first submission, $2 additional',
      maxSubmissions: 6,
      totalSubmissions: 142,
      category: 'Digital Art',
      status: 'active',
      prize: '$5,000 First Prize',
      location: 'New York, NY',
      image: '/placeholder.svg',
      featured: true
    },
    {
      id: '2',
      title: 'AIFilm3 Art & Film Festival',
      organization: 'AIFilm3',
      description: 'Celebrating the convergence of artificial intelligence, art, and cinema. Submit your AI-generated or AI-assisted works.',
      deadline: '2024-04-01',
      submissionFee: 'Free first submission, $2 additional',
      maxSubmissions: 6,
      totalSubmissions: 89,
      category: 'AI Art',
      status: 'active',
      prize: '$10,000 Grand Prize',
      location: 'Los Angeles, CA',
      image: '/placeholder.svg',
      featured: true,
      sponsored: true
    },
    {
      id: '3',
      title: 'Emerging Artists Showcase',
      organization: 'Contemporary Arts Center',
      description: 'Platform for emerging digital artists to showcase their work to industry professionals and collectors.',
      deadline: '2024-03-30',
      submissionFee: 'Free first submission, $2 additional',
      maxSubmissions: 6,
      totalSubmissions: 67,
      category: 'Mixed Media',
      status: 'active',
      prize: 'Exhibition Opportunity',
      location: 'Chicago, IL',
      image: '/placeholder.svg',
      featured: false
    }
  ];

  const categories = ['all', 'Digital Art', 'AI Art', 'Mixed Media', 'Photography', 'Animation'];

  const filteredCalls = mockOpenCalls.filter(call => {
    const matchesSearch = call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || call.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCalls = [...filteredCalls].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'submissions':
        return b.totalSubmissions - a.totalSubmissions;
      case 'featured':
        return b.featured ? 1 : -1;
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
              <div className="text-2xl font-bold text-primary">150+</div>
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
            <Button size="lg" onClick={() => user ? handleSubmit('1') : navigate('/auth/register')}>
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="submissions">Most Popular</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="active" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Calls</TabsTrigger>
            <TabsTrigger value="closing-soon">Closing Soon</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {/* Active Open Calls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <img 
                          src={call.image} 
                          alt={call.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {call.featured && (
                            <Badge className="bg-yellow-500 text-yellow-900">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {call.sponsored && (
                            <Badge className="bg-purple-500 text-white">
                              Sponsored
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <Badge variant="secondary">
                            {call.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {call.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {call.organization}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {call.description}
                        </p>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Deadline: {new Date(call.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{call.submissionFee}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{call.totalSubmissions} submissions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>{call.prize}</span>
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
          </TabsContent>

          <TabsContent value="closing-soon">
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Urgent Opportunities</h3>
              <p className="text-muted-foreground mb-6">
                Open calls closing within the next 7 days
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedCalls.slice(0, 2).map((call, index) => (
                  <Card key={call.id} className="p-6 border-orange-200 bg-orange-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <Badge variant="destructive">Closing Soon</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">{call.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{call.organization}</p>
                    <Button size="sm" onClick={() => handleSubmit(call.id)}>
                      Submit Now
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sortedCalls.filter(call => call.featured).map((call, index) => (
                <Card key={call.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={call.image} 
                        alt={call.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-6">
                      <div className="flex gap-2 mb-3">
                        <Badge className="bg-yellow-500 text-yellow-900">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                        {call.sponsored && (
                          <Badge className="bg-purple-500 text-white">
                            Sponsored
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{call.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{call.organization}</p>
                      <p className="text-sm mb-4">{call.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>{call.prize}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Deadline: {new Date(call.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button onClick={() => handleSubmit(call.id)}>
                        Learn More & Submit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* AIFilm3 Partnership Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge className="bg-purple-500 text-white mb-4">
                  Premium Partnership
                </Badge>
                <h2 className="text-3xl font-bold mb-4">AIFilm3 Art & Film Festival</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join the premier celebration of AI-generated art and cinema. Showcase your work to industry leaders, 
                  collectors, and fellow innovators in the intersection of technology and creativity.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                  <h3 className="font-semibold mb-2">Industry Recognition</h3>
                  <p className="text-sm text-muted-foreground">Get featured in major tech and art publications</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                  <h3 className="font-semibold mb-2">$10,000 Grand Prize</h3>
                  <p className="text-sm text-muted-foreground">Largest prize pool for AI art competitions</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                  <h3 className="font-semibold mb-2">Global Network</h3>
                  <p className="text-sm text-muted-foreground">Connect with 500+ AI artists and filmmakers</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Submit to AIFilm3 Festival
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
