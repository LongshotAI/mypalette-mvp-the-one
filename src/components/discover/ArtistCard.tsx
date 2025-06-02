
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Palette, Calendar, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArtistCardProps {
  artist: {
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
    portfolio_count?: number;
    follower_count?: number;
    is_following?: boolean;
  };
  onFollowChange: (artistId: string, isFollowing: boolean) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onFollowChange }) => {
  const displayName = artist.first_name && artist.last_name 
    ? `${artist.first_name} ${artist.last_name}`
    : artist.username || 'Unknown Artist';

  const initials = artist.first_name && artist.last_name
    ? `${artist.first_name[0]}${artist.last_name[0]}`
    : artist.username?.[0]?.toUpperCase() || 'U';

  const handleFollow = () => {
    onFollowChange(artist.id, !artist.is_following);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          {/* Artist Avatar and Basic Info */}
          <div className="flex items-start space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={artist.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate mb-1">
                {displayName}
              </h3>
              {artist.username && (
                <p className="text-sm text-muted-foreground mb-2">
                  @{artist.username}
                </p>
              )}
              
              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Palette className="h-4 w-4" />
                  <span>{artist.portfolio_count || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{artist.follower_count || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {artist.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {artist.bio}
            </p>
          )}

          {/* Artist Details */}
          <div className="space-y-2 mb-4">
            {artist.location && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{artist.location}</span>
              </div>
            )}
            
            {artist.years_active && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{artist.years_active} years active</span>
              </div>
            )}
          </div>

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
              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                Open for Commissions
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to={`/artist/${artist.username}`}>
                View Profile
              </Link>
            </Button>
            <Button 
              variant={artist.is_following ? "default" : "outline"}
              size="sm"
              onClick={handleFollow}
              className="min-w-0"
            >
              <Heart className={`h-4 w-4 ${artist.is_following ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ArtistCard;
