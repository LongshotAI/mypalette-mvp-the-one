
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Award, Film, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AIFilm3Info = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Film className="h-16 w-16 text-primary mr-4" />
              <div>
                <h1 className="text-5xl font-bold mb-2">AI Film 3</h1>
                <p className="text-xl text-muted-foreground">The Future of AI-Generated Cinema</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="default" className="text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                Community Driven
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Award-Winning
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join the revolutionary AI Film 3 festival - where artificial intelligence meets creative storytelling. 
              Submit your AI-generated films, connect with innovators, and be part of the future of cinema.
            </p>

            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/open-calls">
                  Submit Your Film
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/aifilm3/announcements">
                  Latest Updates
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Festival Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <Card className="text-center">
              <CardContent className="p-6">
                <Film className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">500+</div>
                <p className="text-sm text-muted-foreground">Submissions Expected</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">50+</div>
                <p className="text-sm text-muted-foreground">Countries Participating</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">$50K</div>
                <p className="text-sm text-muted-foreground">Total Prize Pool</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">10+</div>
                <p className="text-sm text-muted-foreground">Award Categories</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About AI Film 3</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  AI Film 3 represents the cutting edge of cinematic innovation, where artificial intelligence 
                  becomes the brush and algorithms become the palette. This festival celebrates the intersection 
                  of technology and creativity, showcasing films that push the boundaries of what's possible 
                  when human imagination meets machine learning.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What We Celebrate</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• AI-generated narratives and scripts</li>
                      <li>• Machine learning visual effects</li>
                      <li>• Procedural animation and characters</li>
                      <li>• AI-composed soundtracks</li>
                      <li>• Experimental AI cinematography</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Submission Categories</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Best AI Short Film (Under 15 minutes)</li>
                      <li>• Most Innovative AI Technique</li>
                      <li>• Best AI-Generated Screenplay</li>
                      <li>• Excellence in AI Visual Effects</li>
                      <li>• People's Choice Award</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Festival Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Submission Period</h3>
                      <p className="text-sm text-muted-foreground">January 1 - March 31, 2024</p>
                      <p className="text-sm mt-1">Submit your AI-generated films through our platform</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Judging Period</h3>
                      <p className="text-sm text-muted-foreground">April 1 - May 15, 2024</p>
                      <p className="text-sm mt-1">Expert panel reviews submissions across all categories</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Awards Ceremony</h3>
                      <p className="text-sm text-muted-foreground">June 1, 2024</p>
                      <p className="text-sm mt-1">Virtual ceremony celebrating the winners and screening finalists</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Submit Your AI Film?</h2>
                <p className="text-muted-foreground mb-6">
                  Join hundreds of innovative filmmakers pushing the boundaries of AI-generated content.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/open-calls">
                      Start Your Submission
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/discover">
                      Explore Past Winners
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AIFilm3Info;
