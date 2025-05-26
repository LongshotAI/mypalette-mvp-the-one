
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Palette,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Briefcase,
  Users,
  Home,
  PlusCircle,
  Search,
  BookOpen,
  Shield
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Discover', href: '/discover', icon: Search },
    { name: 'Open Calls', href: '/open-calls', icon: Briefcase },
    { name: 'Education', href: '/education', icon: BookOpen },
  ];

  const userNavigation = user ? [
    { name: 'My Portfolios', href: '/my-portfolios', icon: Palette },
    { name: 'My Submissions', href: '/submissions', icon: Briefcase },
    { name: 'Profile', href: '/profile', icon: User },
  ] : [];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">MyPalette</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/create-portfolio')}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {userNavigation.map((item) => (
                      <DropdownMenuItem key={item.name} onClick={() => navigate(item.href)}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/host-application')}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Host Open Call
                    </DropdownMenuItem>
                    
                    {/* Admin link - only show for admin users */}
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth/login')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth/register')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium transition-colors hover:bg-muted rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                </Link>
              ))}
              
              {user && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 text-base font-medium transition-colors hover:bg-muted rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </div>
                    </Link>
                  ))}
                  
                  <Link
                    to="/host-application"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Briefcase className="mr-3 h-4 w-4" />
                      Host Open Call
                    </div>
                  </Link>
                  
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Shield className="mr-3 h-4 w-4" />
                      Admin Dashboard
                    </div>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium transition-colors hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </div>
                  </button>
                </>
              )}
              
              {!user && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    to="/auth/login"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
