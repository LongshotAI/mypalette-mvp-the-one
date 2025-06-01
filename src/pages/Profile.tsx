
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MapPin, Calendar, Users, Mail, Globe, Edit } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  // For now, show a placeholder since we don't have the profile data structure set up
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">@{username}</h1>
                  <p className="text-muted-foreground">Artist Profile</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">Digital Artist</Badge>
                    <Badge variant="outline">Available for Commission</Badge>
                  </div>
                </div>
                {user && (
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-muted-foreground mb-4">
                    This profile page is currently under development. Full profile functionality 
                    including portfolios, artworks, and detailed information will be available soon.
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3">Recent Work</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-muted rounded-lg"></div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>Location not specified</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Member since 2024</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>0 followers</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
