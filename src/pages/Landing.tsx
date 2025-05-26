
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortfolios } from '@/hooks/usePortfolios';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Eye, Heart, Palette, Users, Briefcase, BookOpen, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { portfolios, loading, error } = usePortfolios();

  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Stunning Portfolios",
      description: "Create beautiful, professional portfolios with our designer templates."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Artist Community",
      description: "Connect with fellow artists, share your work, and build meaningful relationships."
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Open Calls",
      description: "Discover exhibitions, competitions, and opportunities to showcase your work."
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Education Hub",
      description: "Learn new techniques and grow your artistic skills with expert guidance."
    }
  ];

  const stats = [
    { number: "10K+", label: "Artists" },
    { number: "25K+", label: "Artworks" },
    { number: "500+", label: "Open Calls" },
    { number: "100K+", label: "Views" }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-4 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Join the Creative Community
              </Badge>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Your Art, Your Platform, Your Success
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                MyPalette empowers artists to showcase their work, connect with opportunities, 
                and build their creative careers with professional portfolio tools and a thriving community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/auth/register')} className="px-8">
                  Start Creating Today
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/discover')}>
                  Explore Portfolios
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Portfolios Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Featured Portfolios</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover exceptional work from our community of talented artists
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Unable to load featured portfolios</p>
                <Button variant="outline" onClick={() => navigate('/discover')}>
                  Browse All Portfolios
                </Button>
              </div>
            ) : portfolios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolios.map((portfolio, index) => (
                  <motion.div
                    key={portfolio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden rounded-t-lg">
                          {portfolio.cover_image ? (
                            <img 
                              src={portfolio.cover_image} 
                              alt={portfolio.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Palette className="h-12 w-12 text-primary/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button variant="secondary" size="sm">
                              View Portfolio
                            </Button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {portfolio.profiles?.first_name?.[0] || portfolio.profiles?.username?.[0] || 'A'}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">@{portfolio.profiles?.username}</p>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                            {portfolio.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {portfolio.description || 'A beautiful portfolio showcasing creative work.'}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {portfolio.profiles?.artistic_medium || 'Art'}
                            </Badge>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{portfolio.view_count || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>12</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Palette className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Featured Portfolios Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to create a portfolio and get featured!
                </p>
                <Button onClick={() => navigate('/auth/register')}>
                  Create Your Portfolio
                </Button>
              </div>
            )}

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" onClick={() => navigate('/discover')}>
                View All Portfolios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From portfolio creation to community building, MyPalette provides all the tools you need to grow your artistic career.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Art?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of artists who are already building their careers on MyPalette
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/auth/register')} className="px-8">
                  Create Your Portfolio
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/open-calls')}>
                  Explore Opportunities
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Landing;
