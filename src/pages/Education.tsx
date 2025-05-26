
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Video, FileText, Award, Users, TrendingUp } from 'lucide-react';

const Education = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Education Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from industry experts and grow your artistic skills with our comprehensive education platform
          </p>
        </motion.div>

        {/* Coming Soon Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Education Platform Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            We're creating a comprehensive learning platform with tutorials, courses, and expert guidance.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="text-center p-6">
              <Video className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <h3 className="font-medium mb-2">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Step-by-step video guides</p>
            </Card>
            <Card className="text-center p-6">
              <FileText className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-medium mb-2">Written Guides</h3>
              <p className="text-sm text-muted-foreground">In-depth articles and tutorials</p>
            </Card>
            <Card className="text-center p-6">
              <Award className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-medium mb-2">Courses</h3>
              <p className="text-sm text-muted-foreground">Structured learning paths</p>
            </Card>
            <Card className="text-center p-6">
              <Users className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-medium mb-2">Expert Mentorship</h3>
              <p className="text-sm text-muted-foreground">Learn from industry professionals</p>
            </Card>
            <Card className="text-center p-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-medium mb-2">Career Advice</h3>
              <p className="text-sm text-muted-foreground">Professional development tips</p>
            </Card>
            <Card className="text-center p-6">
              <BookOpen className="h-8 w-8 mx-auto mb-3 text-orange-500" />
              <h3 className="font-medium mb-2">Resource Library</h3>
              <p className="text-sm text-muted-foreground">Curated learning materials</p>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Education;
