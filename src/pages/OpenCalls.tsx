
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, DollarSign, Users, Plus } from 'lucide-react';

const OpenCalls = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Open Calls & Opportunities</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover curated opportunities, exhibitions, and collaborations for digital artists
          </p>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Briefcase className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Opportunities Platform Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            We're building a comprehensive platform to connect artists with amazing opportunities.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-medium mb-2">Exhibitions</h3>
              <p className="text-sm text-muted-foreground">Gallery and online exhibitions</p>
            </Card>
            <Card className="text-center p-6">
              <Users className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-medium mb-2">Collaborations</h3>
              <p className="text-sm text-muted-foreground">Connect with other artists</p>
            </Card>
            <Card className="text-center p-6">
              <DollarSign className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-medium mb-2">Commissions</h3>
              <p className="text-sm text-muted-foreground">Paid artwork opportunities</p>
            </Card>
            <Card className="text-center p-6">
              <Plus className="h-8 w-8 mx-auto mb-3 text-orange-500" />
              <h3 className="font-medium mb-2">Contests</h3>
              <p className="text-sm text-muted-foreground">Art competitions and challenges</p>
            </Card>
          </div>

          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              Want to be notified when we launch?
            </p>
            <Button>Stay Updated</Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OpenCalls;
