
import React from 'react';
import Layout from '@/components/layout/Layout';
import AIFilm3Footer from '@/components/layout/AIFilm3Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Trophy, Film, Clock, ArrowRight, Bell } from 'lucide-react';

const AIFilm3Announcements = () => {
  // This will be connected to admin system in the future
  const announcements = [
    {
      id: 1,
      title: "Festival Registration Now Open",
      date: "2024-03-01",
      category: "Registration",
      urgent: true,
      excerpt: "Submit your AI-generated films for consideration in the third annual AIFilm3 festival.",
      content: "We're excited to announce that registration for AIFilm3 is now officially open! This year's festival promises to be our most ambitious yet, featuring groundbreaking AI-generated films from creators around the world."
    },
    {
      id: 2,
      title: "Keynote Speaker Announcement",
      date: "2024-02-28",
      category: "Event",
      urgent: false,
      excerpt: "Renowned AI researcher Dr. Sarah Chen to deliver opening keynote on the future of AI in cinema.",
      content: "We're thrilled to announce that Dr. Sarah Chen, leading AI researcher and cinema technology pioneer, will be delivering our opening keynote address."
    },
    {
      id: 3,
      title: "New Category: Interactive AI Experiences",
      date: "2024-02-25",
      category: "Categories",
      urgent: false,
      excerpt: "Introducing a new competition category for interactive and immersive AI-powered film experiences.",
      content: "This year we're expanding our competition to include interactive AI experiences, virtual reality films, and immersive storytelling projects."
    },
    {
      id: 4,
      title: "Early Bird Pricing Extended",
      date: "2024-02-20",
      category: "Pricing",
      urgent: false,
      excerpt: "Due to popular demand, we're extending our early bird submission pricing through March 15th.",
      content: "Great news for filmmakers! We've extended our early bird pricing deadline to give more creators the opportunity to submit their work at reduced rates."
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Registration':
        return <Users className="h-4 w-4" />;
      case 'Event':
        return <Calendar className="h-4 w-4" />;
      case 'Categories':
        return <Trophy className="h-4 w-4" />;
      case 'Pricing':
        return <Film className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Registration':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Event':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Categories':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Pricing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <Bell className="mr-2 h-4 w-4" />
                Latest Updates
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AIFilm3 Announcements
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Stay updated with the latest news, deadlines, and important information about the AIFilm3 festival
              </p>
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className={`transition-all hover:shadow-lg ${announcement.urgent ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getCategoryColor(announcement.category)}>
                            {getCategoryIcon(announcement.category)}
                            <span className="ml-1">{announcement.category}</span>
                          </Badge>
                          {announcement.urgent && (
                            <Badge variant="destructive">
                              Urgent
                            </Badge>
                          )}
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(announcement.date).toLocaleDateString()}
                          </div>
                        </div>
                        <CardTitle className="text-2xl mb-2">{announcement.title}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-300">{announcement.excerpt}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {announcement.content}
                    </p>
                    <Button variant="outline" className="group">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Subscription CTA */}
            <Card className="mt-12 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
              <CardContent className="py-8">
                <div className="text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                  <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                    Never miss important AIFilm3 announcements, deadlines, and exclusive updates. 
                    Join our notification system to stay in the loop.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary">
                      Subscribe to Updates
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
                      Join Discord Community
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This page will be connected to the admin dashboard for dynamic content management in future updates.
              </p>
            </div>
          </div>
        </section>
      </div>
      <AIFilm3Footer />
    </Layout>
  );
};

export default AIFilm3Announcements;
