
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, UserCheck } from 'lucide-react';

interface FollowStatsProps {
  followerCount: number;
  followingCount: number;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

const FollowStats = ({ 
  followerCount, 
  followingCount, 
  onFollowersClick, 
  onFollowingClick 
}: FollowStatsProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onFollowersClick}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
      >
        <Users className="h-4 w-4" />
        <span className="font-medium">{followerCount}</span>
        <span>followers</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onFollowingClick}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
      >
        <UserCheck className="h-4 w-4" />
        <span className="font-medium">{followingCount}</span>
        <span>following</span>
      </Button>
    </div>
  );
};

export default FollowStats;
