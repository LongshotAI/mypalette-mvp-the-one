
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MapPin, Calendar, ExternalLink, Mail } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();

  // Mock profile data - in real app, fetch from database
  const profile = {
    username: username || 'artist',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Digital artist specializing in AI-generated art and digital paintings.',
    location: 'New York, NY',
    joinDate: '2023-01-15',
    avatarUrl: '/placeholder.svg',
    website: 'https://johndoe.art',
    isFollowing: false,
    followerCount: 245,
    followingCount: 89,
    artworkCount: 42
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                  <AvatarFallback className="text-2xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {profile.firstName} {profile.lastName}
                      </h1>
                      <p className="text-muted-foreground text-lg">@{profile.username}</p>
                    </div>
                    
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button>
                        {profile.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{profile.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(profile.joinDate).toLocaleDateString()}
                    </div>
                    {profile.website && (
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Website
                      </a>
                    )}
                  </div>
                  
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-semibold">{profile.followerCount}</span> followers
                    </div>
                    <div>
                      <span className="font-semibold">{profile.followingCount}</span> following
                    </div>
                    <div>
                      <span className="font-semibold">{profile.artworkCount}</span> artworks
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No artworks to display yet.</p>
                <p className="text-sm">Check back later to see this artist's work!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
