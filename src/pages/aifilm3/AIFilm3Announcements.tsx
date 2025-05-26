
import React from 'react';
import Layout from '@/components/layout/Layout';
import AIFilm3Footer from '@/components/layout/AIFilm3Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Clock, ArrowRight } from 'lucide-react';

const AIFilm3Announcements = () => {
  const announcements = [
    {
      id: 1,
      title: "AIFilm3 Submission Deadline Extended",
      date: "2024-01-15",
      type: "important",
      excerpt: "We're extending our submission deadline to February 28th to accommodate the overwhelming response from filmmakers worldwide.",
      content: "Due to the incredible interest and quality of submissions we've been receiving, we've decided to extend our submission deadline by two weeks. This gives more filmmakers the opportunity to perfect their AI-enhanced films and join our festival."
    },
    {
      id: 2,
      title: "New Category: AI Music Video Competition",
      date: "2024-01-10",
      type: "new",
      excerpt: "Introducing a brand new category celebrating the fusion of AI-generated music and visual storytelling.",
      content: "We're excited to announce our newest competition category focusing on AI-generated music videos. This category celebrates the intersection of artificial intelligence in both audio and visual creation."
    },
    {
      id: 3,
      title: "Partnership with OpenAI Announced",
      date: "2024-01-05",
      type: "partnership",
      excerpt: "AIFilm3 partners with OpenAI to provide exclusive workshops and resources for festival participants.",
      content: "We're thrilled to announce our partnership with OpenAI, bringing exclusive workshops, technical resources, and expert guidance to our festival participants."
    },
    {
      id: 4,
      title: "Virtual Reality Screening Experience",
      date: "2023-12-20",
      type: "feature",
      excerpt: "Experience selected films in our new VR cinema environment, pushing the boundaries of immersive storytelling.",
      content: "Selected films will be available in our revolutionary VR cinema experience, allowing audiences to step inside AI-generated worlds like never before."
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'new': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'partnership': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'feature': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'important': return 'Important';
      case 'new': return 'New';
      case 'partnership': return 'Partnership';
      case 'feature': return 'Feature';
      default: return 'Update';
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-purple-600 mr-3" />
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Latest Updates
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AIFilm3 Announcements
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Stay updated with the latest news, deadlines, and exciting developments from AIFilm3
            </p>
          </div>
        </section>

        {/* Announcements List */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-8">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getTypeColor(announcement.type)}>
                            {getTypeLabel(announcement.type)}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(announcement.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <CardTitle className="text-2xl mb-3">{announcement.title}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                          {announcement.excerpt}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {announcement.content}
                    </p>
                    <Button variant="outline" className="group">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Newsletter Signup */}
            <Card className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Stay in the Loop</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg mb-6 text-purple-100">
                  Subscribe to our newsletter for the latest AIFilm3 updates and exclusive content
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500"
                  />
                  <Button className="bg-white text-purple-600 hover:bg-gray-100">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <AIFilm3Footer />
    </Layout>
  );
};

export default AIFilm3Announcements;
