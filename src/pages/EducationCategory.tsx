
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';

const EducationCategory = () => {
  const { category } = useParams();

  const categoryData = {
    'digital-art': {
      title: 'Digital Art',
      description: 'Master the fundamentals and advanced techniques of digital art creation',
      color: 'bg-blue-500'
    },
    'portfolio': {
      title: 'Portfolio Building',
      description: 'Learn how to create compelling portfolios that showcase your best work',
      color: 'bg-green-500'
    },
    'business': {
      title: 'Art Business',
      description: 'Develop the business skills needed to succeed as a professional artist',
      color: 'bg-purple-500'
    }
  };

  const currentCategory = categoryData[category as keyof typeof categoryData] || categoryData['digital-art'];

  const mockContent = [
    {
      id: '1',
      title: 'Getting Started with Digital Art',
      preview: 'Learn the basics of digital art including tools, techniques, and workflow.',
      readTime: '15 min read',
      author: 'Sarah Johnson',
      thumbnail: null
    },
    {
      id: '2',
      title: 'Color Theory for Digital Artists',
      preview: 'Understanding color relationships and how to use them effectively in your art.',
      readTime: '20 min read',
      author: 'Mike Chen',
      thumbnail: null
    },
    {
      id: '3',
      title: 'Building Your First Portfolio',
      preview: 'Step-by-step guide to creating a portfolio that gets noticed.',
      readTime: '25 min read',
      author: 'Elena Rodriguez',
      thumbnail: null
    }
  ];

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
            <div className={`w-16 h-16 mx-auto mb-4 ${currentCategory.color} rounded-2xl flex items-center justify-center`}>
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{currentCategory.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentCategory.description}
            </p>
          </motion.div>

          {/* Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-6"
          >
            {mockContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 2) }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-primary/60" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {content.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {content.preview}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{content.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{content.readTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Badge variant="secondary">Article</Badge>
                        <ArrowRight className="h-5 w-5 mt-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              More content coming soon for {currentCategory.title}!
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationCategory;
