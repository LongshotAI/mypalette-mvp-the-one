
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MapPin, Calendar, Users, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ArtistProfile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  artistic_medium: string | null;
  artistic_style: string | null;
  years_active: number | null;
  available_for_commission: boolean | null;
  created_at: string | null;
  portfolio_count?: number;
  follower_count?: number;
  is_following?: boolean;
}

interface ArtistCardProps {
  artist: ArtistProfile;
  onFollowChange?: (artistId: string, isFollowing: boolean) => void;
}

const ArtistCard = ({ artist, onFollowChange }: ArtistCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(artist.is_following || false);
  const [followerCount, setFollowerCount] = useState(artist.follower_count || 0);
  const [isLoading, setIsLoading] = useState(false);

  const getArtistName = () => {
    if (artist.first_name && artist.last_name) {
      return `${artist.first_name} ${artist.last_name}`;
    }
    return artist.username || 'Unknown Artist';
  };

  const getInitials = () => {
    const name = getArtistName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow artists",
        variant: "destructive"
      });
      return;
    }

    if (user.id === artist.id) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', artist.id);

        if (error) throw error;

        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
        
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${getArtistName()}`
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: artist.id
          });

        if (error) throw error;

        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        
        toast({
          title: "Following",
          description: `You are now following ${getArtistName()}`
        });
      }

      onFollowChange?.(artist.id, !isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-shadow group">
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            {/* Header with Avatar and Follow Button */}
            <div className="flex items-start justify-between mb-4">
              <Link to={`/artists/${artist.username}`} className="flex items-center space-x-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={artist.avatar_url || undefined} alt={getArtistName()} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40">
                    {artist.avatar_url ? <User className="h-8 w-8" /> : getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {getArtistName()}
                  </h3>
                  {artist.username && (
                    <p className="text-muted-foreground text-sm">@{artist.username}</p>
                  )}
                </div>
              </Link>

              {user && user.id !== artist.id && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={handleFollow}
                  disabled={isLoading}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isFollowing ? (
                    <>
                      <Heart className="h-4 w-4 mr-1 fill-current" />
                      Following
                    </>
                  ) : (
                    'Follow'
                  )}
                </Button>
              )}
            </div>

            {/* Bio */}
            {artist.bio && (
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                {artist.bio}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {artist.artistic_medium && (
                <Badge variant="secondary" className="text-xs">
                  {artist.artistic_medium}
                </Badge>
              )}
              {artist.artistic_style && (
                <Badge variant="outline" className="text-xs">
                  {artist.artistic_style}
                </Badge>
              )}
              {artist.available_for_commission && (
                <Badge variant="default" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
                  Commissions Open
                </Badge>
              )}
            </div>

            {/* Stats and Info */}
            <div className="space-y-2 text-xs text-muted-foreground">
              {artist.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{artist.location}</span>
                </div>
              )}
              
              {artist.years_active && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{artist.years_active} years active</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {typeof followerCount === 'number' && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{followerCount} followers</span>
                    </div>
                  )}
                  
                  {typeof artist.portfolio_count === 'number' && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>{artist.portfolio_count} portfolios</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ArtistCard;
