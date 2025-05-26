
import { Outlet } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Palette } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-600/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center">
            <Palette className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">MyPalette</h1>
          <p className="text-muted-foreground">Your creative portfolio platform</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
