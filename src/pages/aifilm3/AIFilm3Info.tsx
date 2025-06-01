
import React from 'react';
import Layout from '@/components/layout/Layout';
import AIFilm3Footer from '@/components/layout/AIFilm3Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Trophy, Film, ExternalLink } from 'lucide-react';

const AIFilm3Info = () => {
  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              AI Film Festival 2024
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AIFilm3
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The third annual AI Film Festival celebrating the intersection of artificial intelligence and cinematic artistry
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Calendar className="mr-2 h-5 w-5" />
                View Schedule
              </Button>
              <Button size="lg" variant="outline">
                <Film className="mr-2 h-5 w-5" />
                Watch Films
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">About AIFilm3</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  AIFilm3 represents the cutting edge of cinematic innovation, where artificial intelligence meets human creativity. Our festival showcases groundbreaking films that push the boundaries of storytelling through AI technology.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  From AI-generated narratives to machine learning-enhanced visuals, AIFilm3 celebrates the future of filmmaking and the endless possibilities that emerge when technology amplifies human imagination.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Festival Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Film className="h-6 w-6 text-purple-600" />
                    <span>50+ AI-generated films</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-blue-600" />
                    <span>International filmmaker community</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    <span>Innovation awards & recognition</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                    <span>3-day virtual experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-white/50 dark:bg-gray-900/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Chen",
                  role: "Festival Director",
                  bio: "AI researcher and filmmaker with 10+ years in emerging technologies"
                },
                {
                  name: "Sarah Johnson",
                  role: "Creative Director",
                  bio: "Award-winning director specializing in AI-human collaborative storytelling"
                },
                {
                  name: "Michael Rodriguez",
                  role: "Technical Director",
                  bio: "Machine learning engineer and cinema technology innovator"
                }
              ].map((member, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mb-4"></div>
                    <CardTitle>{member.name}</CardTitle>
                    <p className="text-purple-600 font-medium">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                    Opening Ceremony
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Join us for the grand opening of AIFilm3 featuring keynote presentations and premiere screenings.
                  </p>
                  <Badge variant="outline">March 15, 2024</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    Panel Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Industry experts discuss the future of AI in filmmaking and creative collaboration.
                  </p>
                  <Badge variant="outline">March 16, 2024</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <AIFilm3Footer />
    </Layout>
  );
};

export default AIFilm3Info;
