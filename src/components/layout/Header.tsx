
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Palette, 
  Plus,
  Menu,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import SearchCommand from '@/components/discover/SearchCommand';

interface HeaderProps {
  showNotifications?: boolean;
}

const Header = ({ showNotifications = true }: HeaderProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const userInitials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : profile?.username?.[0]?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Palette className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">MyPalette</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists, portfolios..."
                className="pl-10 cursor-pointer"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
            </div>
            <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/discover">Discover</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/open-calls">Open Calls</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/education">Learn</Link>
              </Button>
            </nav>

            {user ? (
              <>
                {/* Create Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/my-portfolios" className="flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        New Portfolio
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/host-application" className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Host Open Call
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.first_name && profile?.last_name && (
                          <p className="font-medium">
                            {profile.first_name} {profile.last_name}
                          </p>
                        )}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        {profile?.role && (
                          <Badge variant="outline" className="w-fit">
                            {profile.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-portfolios" className="flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        My Portfolios
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {profile?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/discover">Discover</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/open-calls">Open Calls</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/education">Learn</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
