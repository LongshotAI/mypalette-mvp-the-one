
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminDebugInfo = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading, error } = useAdminCheck();

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm">Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span>User:</span>
          <Badge variant="outline">{user?.email || 'Not logged in'}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Role:</span>
          <Badge variant={userRole === 'admin' ? 'default' : 'destructive'}>
            {userRole || 'No role'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Auth Loading:</span>
          <Badge variant={authLoading ? 'secondary' : 'outline'}>
            {authLoading.toString()}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Role Loading:</span>
          <Badge variant={roleLoading ? 'secondary' : 'outline'}>
            {roleLoading.toString()}
          </Badge>
        </div>
        {error && (
          <div className="flex items-center gap-2">
            <span>Error:</span>
            <Badge variant="destructive">{error.message}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDebugInfo;
