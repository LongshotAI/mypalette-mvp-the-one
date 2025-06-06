
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Shield, User, Crown, UserX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  artistic_medium: string | null;
}

const EnhancedUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users', roleFilter],
    queryFn: async () => {
      console.log('Fetching users for admin management...');
      
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Users fetched:', data);
      return data as UserProfile[];
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole, userEmail }: { userId: string; newRole: 'user' | 'admin'; userEmail?: string }) => {
      console.log('Updating user role:', userId, newRole);
      
      // Special protection for lshot.crypto@gmail.com
      if (userEmail === 'lshot.crypto@gmail.com' && newRole !== 'admin') {
        throw new Error('Cannot modify the primary admin account');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role.",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users?.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.artistic_medium?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const isCurrentUserPrimaryAdmin = currentUser?.email === 'lshot.crypto@gmail.com';
  const userStats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    users: users?.filter(u => u.role === 'user').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading users. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Controls Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">
            {isCurrentUserPrimaryAdmin && (
              <span className="flex items-center gap-1 text-orange-600">
                <Crown className="h-3 w-3" />
                Primary Admin - Full Control
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{userStats.total} Total Users</Badge>
          <Badge variant="destructive">{userStats.admins} Admins</Badge>
          <Badge variant="secondary">{userStats.users} Users</Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, username, or medium..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'admin', 'user'] as const).map((filter) => (
            <Button
              key={filter}
              variant={roleFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoleFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter !== 'all' && (
                <Badge variant="secondary" className="ml-2">
                  {filter === 'admin' ? userStats.admins : userStats.users}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const isPrimaryAdmin = user.id === currentUser?.id && currentUser?.email === 'lshot.crypto@gmail.com';
                const isProtectedUser = user.id === currentUser?.id; // Users can't modify themselves
                
                return (
                  <TableRow key={user.id} className={isPrimaryAdmin ? 'bg-orange-50 border-orange-200' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center relative">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.first_name || 'User'}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          {isPrimaryAdmin && (
                            <Crown className="absolute -top-1 -right-1 h-3 w-3 text-orange-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                            {isPrimaryAdmin && <span className="text-xs text-orange-600 ml-1">(You)</span>}
                          </p>
                          {user.bio && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {user.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {user.username || 'No username'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                        {getRoleIcon(user.role)}
                        {user.role}
                        {isPrimaryAdmin && <Crown className="h-3 w-3" />}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {user.artistic_medium || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {user.location || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {!isProtectedUser && isCurrentUserPrimaryAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => updateUserRole.mutate({
                                userId: user.id,
                                newRole: user.role === 'admin' ? 'user' : 'admin',
                                userEmail: currentUser?.email || ''
                              })}
                              disabled={updateUserRole.isPending}
                            >
                              {user.role === 'admin' ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Real-time Stats Footer */}
      <div className="flex gap-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <span>Total Users: <strong>{userStats.total}</strong></span>
        <span>Admins: <strong>{userStats.admins}</strong></span>
        <span>Regular Users: <strong>{userStats.users}</strong></span>
        <span>Last Updated: <strong>{new Date().toLocaleTimeString()}</strong></span>
      </div>
    </div>
  );
};

export default EnhancedUserManagement;
