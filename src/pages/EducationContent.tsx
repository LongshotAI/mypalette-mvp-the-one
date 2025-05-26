
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Share2, Heart, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EducationContent = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock content data
  const content = {
    title: 'Getting Started with Digital Art',
    author: 'Sarah Johnson',
    publishDate: 'March 15, 2024',
    readTime: '15 min read',
    category: 'Digital Art',
    content: `
      <h2>Introduction to Digital Art</h2>
      <p>Digital art has revolutionized the way artists create and share their work. Whether you're a traditional artist looking to transition to digital mediums or a complete beginner, this guide will help you get started on your digital art journey.</p>
      
      <h3>Essential Tools and Software</h3>
      <p>Before you begin creating digital art, you'll need the right tools. Here are the essentials:</p>
      <ul>
        <li><strong>Drawing Tablet:</strong> A pressure-sensitive tablet is crucial for natural drawing experience</li>
        <li><strong>Software:</strong> Popular options include Adobe Photoshop, Procreate, or free alternatives like Krita</li>
        <li><strong>Computer:</strong> A device capable of running your chosen software smoothly</li>
      </ul>
      
      <h3>Basic Techniques</h3>
      <p>Start with these fundamental techniques to build your skills:</p>
      <ol>
        <li>Understanding layers and their uses</li>
        <li>Brush selection and customization</li>
        <li>Color theory and digital color mixing</li>
        <li>Basic composition principles</li>
      </ol>
      
      <h3>Practice Projects</h3>
      <p>The best way to learn is by doing. Try these beginner-friendly projects:</p>
      <ul>
        <li>Simple character sketches</li>
        <li>Digital painting studies</li>
        <li>Logo design exercises</li>
        <li>Photo manipulation projects</li>
      </ul>
      
      <h2>Next Steps</h2>
      <p>Once you've mastered the basics, consider exploring more advanced topics like advanced lighting techniques, character design, or digital illustration styles. Remember, digital art is a journey of continuous learning and experimentation.</p>
    `
  };

  const handleBack = () => {
    navigate('/education/digital-art');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="outline" size="sm" onClick={handleBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {content.category}
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-4">
              {content.category}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{content.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{content.readTime}</span>
              </div>
              <span>{content.publishDate}</span>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Color Theory for Digital Artists', readTime: '20 min read' },
                { title: 'Advanced Brush Techniques', readTime: '18 min read' }
              ].map((article, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary/60" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{article.title}</h4>
                        <p className="text-sm text-muted-foreground">{article.readTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationContent;
