
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Eye, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EducationContent = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/education')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Education Hub
          </Button>

          {/* Article Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary">Tutorial</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>1,234 views</span>
                </div>
              </div>
              
              <CardTitle className="text-3xl mb-4">
                Complete Guide to Digital Art Creation
              </CardTitle>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Art Expert</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>15 min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Beginner Level</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h2>Introduction</h2>
                <p className="text-muted-foreground">
                  This is a placeholder for the full educational content. When the education system 
                  is fully implemented, rich content including text, images, videos, and interactive 
                  elements will be displayed here.
                </p>
                
                <h2>What You'll Learn</h2>
                <ul className="text-muted-foreground">
                  <li>Digital art fundamentals</li>
                  <li>Essential tools and software</li>
                  <li>Composition and color theory</li>
                  <li>Professional techniques</li>
                </ul>
                
                <h2>Coming Soon</h2>
                <p className="text-muted-foreground">
                  The full education content management system with rich text editing, 
                  media embedding, and interactive features will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article slug reference */}
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Content slug: {slug}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationContent;
