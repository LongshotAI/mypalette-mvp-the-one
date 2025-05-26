
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User } from 'lucide-react';

const EducationCategory = () => {
  const { category } = useParams();

  const mockArticles = [
    {
      id: 1,
      title: "Getting Started with Digital Art",
      preview: "Learn the fundamentals of digital art creation and essential tools.",
      readTime: "5 min read",
      author: "Art Mentor",
    },
    {
      id: 2,
      title: "Building Your First Portfolio",
      preview: "Step-by-step guide to creating a professional art portfolio.",
      readTime: "8 min read",
      author: "Portfolio Expert",
    },
    {
      id: 3,
      title: "NFT Marketplace Strategies",
      preview: "How to successfully launch and promote your NFT collection.",
      readTime: "12 min read",
      author: "NFT Specialist",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 capitalize">
              {category?.replace('-', ' ')} Resources
            </h1>
            <p className="text-lg text-muted-foreground">
              Educational content and tutorials for {category?.replace('-', ' ')}
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6">
            {mockArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <Badge variant="secondary">{category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{article.preview}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <BookOpen className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">More Content Coming Soon</h3>
            <p className="text-muted-foreground">
              We're continuously adding new educational resources and tutorials.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationCategory;
