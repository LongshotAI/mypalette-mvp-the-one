
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MapPin, Calendar, Globe, Mail, Phone, Palette, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PortfolioCard from '@/components/portfolio/PortfolioCard';

const ArtistProfile = () => {
  const { username } = useParams();

  // Fetch artist profile by username
  const { data: artist, isLoading: artistLoading, error: artistError } = useQuery({
    queryKey: ['artist-profile', username],
    queryFn: async () => {
      if (!username) throw new Error('No username provided');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!username,
  });

  // Fetch artist's public portfolios
  const { data: portfolios, isLoading: portfoliosLoading } = useQuery({
    queryKey: ['artist-portfolios', artist?.id],
    queryFn: async () => {
      if (!artist?.id) return [];

      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles(username, first_name, last_name, avatar_url, artistic_medium)
        `)
        .eq('user_id', artist.id)
        .eq('is_public', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!artist?.id,
  });

  const { data: followStats } = useQuery({
    queryKey: ['follow-stats', artist?.id],
    queryFn: async () => {
      if (!artist?.id) return { followers: 0, following: 0 };

      const [followersResult, followingResult] = await Promise.all([
        supabase
          .from('follows')
          .select('id', { count: 'exact' })
          .eq('following_id', artist.id),
        supabase
          .from('follows')
          .select('id', { count: 'exact' })
          .eq('follower_id', artist.id)
      ]);

      return {
        followers: followersResult.count || 0,
        following: followingResult.count || 0
      };
    },
    enabled: !!artist?.id,
  });

  if (artistLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (artistError || !artist) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The artist you're looking for doesn't exist or their profile is not public.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const displayName = artist.first_name && artist.last_name 
    ? `${artist.first_name} ${artist.last_name}`
    : artist.username || 'Unknown Artist';

  const initials = artist.first_name && artist.last_name
    ? `${artist.first_name[0]}${artist.last_name[0]}`
    : artist.username?.[0]?.toUpperCase() || 'U';

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <Avatar className="w-32 h-32 mx-auto md:mx-0">
                      <AvatarImage src={artist.avatar_url || undefined} alt={displayName} />
                      <AvatarFallback className="text-2xl font-bold bg-primary/10">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                      <p className="text-lg text-muted-foreground mb-4">@{artist.username}</p>
                      
                      {/* Stats */}
                      <div className="flex justify-center md:justify-start gap-6 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{portfolios?.length || 0}</div>
                          <div className="text-sm text-muted-foreground">Portfolios</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{followStats?.followers || 0}</div>
                          <div className="text-sm text-muted-foreground">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{followStats?.following || 0}</div>
                          <div className="text-sm text-muted-foreground">Following</div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                        {artist.artistic_medium && (
                          <Badge variant="secondary">{artist.artistic_medium}</Badge>
                        )}
                        {artist.artistic_style && (
                          <Badge variant="outline">{artist.artistic_style}</Badge>
                        )}
                        {artist.available_for_commission && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Available for Commission
                          </Badge>
                        )}
                      </div>
                      
                      {artist.bio && (
                        <p className="text-muted-foreground mb-6 max-w-2xl">
                          {artist.bio}
                        </p>
                      )}
                      
                      {/* Contact Info */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-6">
                        {artist.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{artist.location}</span>
                          </div>
                        )}
                        {artist.years_active && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{artist.years_active} years active</span>
                          </div>
                        )}
                        {artist.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <a href={artist.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <Button variant="outline">Follow</Button>
                        <Button variant="outline">Message</Button>
                        {artist.available_for_commission && (
                          <Button>Commission Work</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Portfolios Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Portfolios</h2>
            
            {portfoliosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : portfolios && portfolios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((portfolio) => (
                  <PortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    showActions={false}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Palette className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Public Portfolios</h3>
                  <p className="text-muted-foreground">
                    This artist hasn't made any portfolios public yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistProfile;
