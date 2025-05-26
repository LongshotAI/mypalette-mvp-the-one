
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, MapPin, Calendar, Globe, Mail, Phone } from 'lucide-react';

const ArtistProfile = () => {
  const { username } = useParams();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <User className="h-16 w-16 text-primary/60" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">Artist Profile</h1>
                  <p className="text-muted-foreground mb-4">@{username}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Digital Art</Badge>
                    <Badge variant="secondary">NFT</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Artist bio will be displayed here. This is a placeholder for the artist's description and background.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Active since 2020</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button>Follow</Button>
                  <Button variant="outline">Message</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Artist Profile Coming Soon</h2>
            <p className="text-muted-foreground">
              Full artist profiles with portfolios, social links, and commission info will be available soon.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistProfile;
