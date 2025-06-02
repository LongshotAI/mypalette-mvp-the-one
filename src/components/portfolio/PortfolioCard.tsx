
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, ExternalLink, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Portfolio } from '@/hooks/usePortfolios';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onDelete?: (portfolioId: string) => void;
  showActions?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolio,
  onDelete,
  showActions = false
}) => {
  const handleDelete = () => {
    if (onDelete && portfolio.id) {
      onDelete(portfolio.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        {/* Cover Image */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
          {portfolio.cover_image ? (
            <img
              src={portfolio.cover_image}
              alt={portfolio.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-primary/60" />
                </div>
                <p className="text-sm text-muted-foreground">No cover image</p>
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={portfolio.is_public ? "default" : "secondary"}>
              {portfolio.is_public ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
          </div>

          {/* Featured Badge */}
          {portfolio.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="bg-yellow-500 text-yellow-900 border-yellow-600">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Portfolio Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
              {portfolio.title}
            </h3>
            {portfolio.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {portfolio.description}
              </p>
            )}
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{portfolio.view_count || 0} views</span>
                </div>
                {portfolio.template_id && (
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {portfolio.template_id}
                    </Badge>
                  </div>
                )}
              </div>
              
              {portfolio.created_at && (
                <span className="text-xs">
                  {new Date(portfolio.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to={`/portfolio/${portfolio.slug}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to={`/portfolio/${portfolio.slug}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PortfolioCard;
