
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Award, ArrowRight, Star } from 'lucide-react';

const OpenCallsPreview = () => {
  const navigate = useNavigate();

  // Featured open calls preview
  const featuredCalls = [
    {
      id: '1',
      title: 'Digital Futures Exhibition',
      organization: 'Modern Art Gallery NYC',
      deadline: '2024-03-15',
      prize: '$5,000 First Prize',
      image: '/placeholder.svg',
      featured: true
    },
    {
      id: '2',
      title: 'AIFilm3 Art & Film Festival',
      organization: 'AIFilm3',
      deadline: '2024-04-01',
      prize: '$10,000 Grand Prize',
      image: '/placeholder.svg',
      sponsored: true
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Live Opportunities
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Active Open Calls</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Submit your artwork to prestigious galleries, festivals, and exhibitions. 
            Your first submission is always free!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredCalls.map((call, index) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
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
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {call.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{call.organization}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Deadline: {new Date(call.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-green-600">Free first submission</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>{call.prize}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full group" onClick={() => navigate('/open-calls')}>
                    Submit Your Art
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick stats and CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <div className="text-2xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Active Calls</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">$50K+</div>
              <div className="text-sm text-muted-foreground">Total Prizes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">Free</div>
              <div className="text-sm text-muted-foreground">First Submission</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">2,500+</div>
              <div className="text-sm text-muted-foreground">Participating Artists</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/open-calls')}>
              Explore All Open Calls
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/auth/register')}>
              Start Your Portfolio
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OpenCallsPreview;
