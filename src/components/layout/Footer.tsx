
import { Link } from 'react-router-dom';
import { Heart, Mail, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/17ab5ff7-92d6-4e07-ba7a-67585c399503.png" 
                alt="MyPalette Logo" 
                className="h-6 w-auto"
              />
              <h3 className="text-lg font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
                MyPalette
              </h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Showcase Your Art, Discover Opportunities. The premier platform for digital artists to build stunning portfolios and connect with opportunities.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/discover" className="hover:text-foreground transition-colors">
                  Discover Artists
                </Link>
              </li>
              <li>
                <Link to="/open-calls" className="hover:text-foreground transition-colors">
                  Open Calls
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-foreground transition-colors">
                  Education Hub
                </Link>
              </li>
              <li>
                <Link to="/auth/register" className="hover:text-foreground transition-colors">
                  Join MyPalette
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/education/getting-started" className="hover:text-foreground transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link to="/education/portfolio-tips" className="hover:text-foreground transition-colors">
                  Portfolio Tips
                </Link>
              </li>
              <li>
                <Link to="/education/nft-guide" className="hover:text-foreground transition-colors">
                  NFT Guide
                </Link>
              </li>
              <li>
                <Link to="/education/career-advice" className="hover:text-foreground transition-colors">
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="mailto:hello@mypalette.art" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/mypalette" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/mypalette" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/mypalette" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Contact us for partnerships, support, or feature requests.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-xs text-muted-foreground">
            © 2024 MyPalette. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span>for artists worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
