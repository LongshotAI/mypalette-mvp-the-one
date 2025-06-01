
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Bell, Trophy, Users, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AIFilm3Announcements = () => {
  const announcements = [
    {
      id: 1,
      title: "AI Film 3 Submission Period Now Open!",
      date: "2024-01-01",
      type: "announcement",
      content: "We're excited to announce that submissions for AI Film 3 are now officially open! Submit your innovative AI-generated films and be part of the future of cinema.",
      isNew: true,
    },
    {
      id: 2,
      title: "New Prize Category: Best AI Soundtrack",
      date: "2024-01-15",
      type: "update",
      content: "Due to popular demand, we're adding a new category specifically for AI-generated music and soundtracks. Total prize pool increased to $60K!",
      isNew: true,
    },
    {
      id: 3,
      title: "Judge Panel Announced",
      date: "2024-01-10",
      type: "news",
      content: "Meet our distinguished panel of judges including industry veterans from Pixar, Netflix, and leading AI research institutions.",
      isNew: false,
    },
    {
      id: 4,
      title: "Submission Guidelines Updated",
      date: "2024-01-05",
      type: "update",
      content: "We've clarified our submission guidelines to better accommodate various AI tools and techniques. Check out the updated requirements.",
      isNew: false,
    },
    {
      id: 5,
      title: "Early Bird Discount Extended",
      date: "2023-12-20",
      type: "announcement",
      content: "Due to overwhelming response, we're extending the early bird submission discount until January 31st. Save 50% on submission fees!",
      isNew: false,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-500';
      case 'update': return 'bg-green-500';
      case 'news': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Megaphone className="h-4 w-4" />;
      case 'update': return <Bell className="h-4 w-4" />;
      case 'news': return <Trophy className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">AI Film 3 Announcements</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stay updated with the latest news, updates, and announcements from AI Film 3
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/aifilm3/info">
                  Festival Info
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/open-calls">
                  Submit Now
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="text-center">
              <CardContent className="p-6">
                <Trophy className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">$60K</div>
                <p className="text-sm text-muted-foreground">Updated Prize Pool</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">150+</div>
                <p className="text-sm text-muted-foreground">Current Submissions</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">89</div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
            
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`${announcement.isNew ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            variant="secondary" 
                            className={`${getTypeColor(announcement.type)} text-white flex items-center gap-1`}
                          >
                            {getTypeIcon(announcement.type)}
                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                          </Badge>
                          {announcement.isNew && (
                            <Badge variant="destructive">New</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{announcement.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(announcement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {announcement.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-4">Never Miss an Update</h2>
                <p className="text-muted-foreground mb-6">
                  Get the latest AI Film 3 announcements, deadlines, and exclusive content delivered to your inbox.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg">
                    Subscribe to Updates
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/aifilm3/info">
                      Learn More
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

export default AIFilm3Announcements;
