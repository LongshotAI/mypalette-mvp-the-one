
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Edit, Palette, MapPin, Globe, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="text-muted-foreground">Please sign in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.first_name || 'User'}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {profile.first_name} {profile.last_name}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">
                      @{profile.username || 'artist'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge variant={profile.role === 'admin' ? 'destructive' : 'outline'}>
                        {profile.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              {profile.bio && (
                <div className="mt-6">
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}
              
              {profile.artistic_medium && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <span className="font-medium">Medium:</span>
                    <span className="text-muted-foreground">{profile.artistic_medium}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Artist Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Artistic Style</label>
                  <p className="mt-1">{profile.artistic_style || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Years Active</label>
                  <p className="mt-1">{profile.years_active || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Available for Commission</label>
                  <p className="mt-1">{profile.available_for_commission ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Education</label>
                  <p className="mt-1">{profile.education || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Awards</label>
                  <p className="mt-1">{profile.awards || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Exhibitions</label>
                  <p className="mt-1">{profile.exhibitions || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {profile.artist_statement && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Artist Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.artist_statement}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
