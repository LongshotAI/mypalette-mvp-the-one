
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users, MapPin, Clock } from 'lucide-react';

const OpenCallDetails = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">Open Call Title</CardTitle>
                  <p className="text-muted-foreground">Organized by Gallery Name</p>
                </div>
                <Badge variant="secondary">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Deadline</p>
                    <p className="text-sm text-muted-foreground">March 15, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Submission Fee</p>
                    <p className="text-sm text-muted-foreground">$25</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Max Submissions</p>
                    <p className="text-sm text-muted-foreground">100 artworks</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="w-full md:w-auto">
                Submit Your Work
              </Button>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About This Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is a placeholder for the open call description. The full description, requirements, 
                and submission guidelines will be displayed here when the open calls system is implemented.
              </p>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">Full Open Call System Coming Soon</h3>
            <p className="text-muted-foreground">Open Call ID: {id}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpenCallDetails;
