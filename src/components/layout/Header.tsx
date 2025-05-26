
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProfile } from '@/hooks/useProfile';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import GlobalSearch from './GlobalSearch';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useProfile();
  const { data: userRole } = useAdminCheck();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/17ab5ff7-92d6-4e07-ba7a-67585c399503.png" 
              alt="MyPalette Logo" 
              className="h-6 w-auto"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
              MyPalette
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/discover"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath('/discover') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Discover
            </Link>
            <Link
              to="/open-calls"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath('/open-calls') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Open Calls
            </Link>
            <Link
              to="/education"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath('/education') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Education
            </Link>
            
            {/* AIFilm3 Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath('/aifilm3') ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  <span>AIFilm3</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/aifilm3/info" className="w-full">
                    About AIFilm3
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/aifilm3/announcements" className="w-full">
                    Announcements
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <GlobalSearch />

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </Button>

            {/* User menu or auth buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
                      <AvatarFallback>
                        {getInitials(profile?.first_name, profile?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-portfolios">My Portfolios</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/settings">Settings</Link>
                  </DropdownMenuItem>
                  {userRole === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Badge variant="secondary" className="mr-2">Admin</Badge>
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">
                    Join MyPalette
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="flex flex-col space-y-4 px-4 py-6">
              <Link
                to="/discover"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath('/discover') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Discover
              </Link>
              <Link
                to="/open-calls"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath('/open-calls') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Open Calls
              </Link>
              <Link
                to="/education"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath('/education') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Education
              </Link>
              
              {/* AIFilm3 Mobile Links */}
              <div className="pl-4 border-l-2 border-muted">
                <div className="text-sm font-medium text-muted-foreground mb-2">AIFilm3</div>
                <Link
                  to="/aifilm3/info"
                  className={`block text-sm font-medium transition-colors hover:text-primary ${
                    isActivePath('/aifilm3/info') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  About AIFilm3
                </Link>
                <Link
                  to="/aifilm3/announcements"
                  className={`block text-sm font-medium transition-colors hover:text-primary mt-2 ${
                    isActivePath('/aifilm3/announcements') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Announcements
                </Link>
              </div>

              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link to="/auth/login">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button className="w-full">
                      Join MyPalette
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
