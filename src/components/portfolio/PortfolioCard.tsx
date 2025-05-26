
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Heart, MoreVertical, Edit, Globe, Lock, Trash2, Image } from 'lucide-react';
import { Portfolio } from '@/hooks/usePortfolios';
import { formatDistanceToNow } from 'date-fns';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onEdit?: (portfolio: Portfolio) => void;
  onDelete?: (portfolioId: string) => void;
  showActions?: boolean;
}

const PortfolioCard = ({ portfolio, onEdit, onDelete, showActions = false }: PortfolioCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleEdit = () => {
    onEdit?.(portfolio);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      onDelete?.(portfolio.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
        <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-secondary/10">
          {portfolio.cover_image && !imageError ? (
            <img
              src={portfolio.cover_image}
              alt={portfolio.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Image className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Actions Dropdown */}
          {showActions && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Privacy Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant={portfolio.is_public ? "default" : "secondary"} className="text-xs">
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
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold line-clamp-1">{portfolio.title}</h3>
              {portfolio.is_featured && (
                <Badge variant="outline" className="text-xs">Featured</Badge>
              )}
            </div>
            
            {portfolio.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {portfolio.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {portfolio.view_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  0
                </span>
              </div>
              {portfolio.updated_at && (
                <span>
                  Updated {formatDistanceToNow(new Date(portfolio.updated_at), { addSuffix: true })}
                </span>
              )}
            </div>

            <div className="pt-2">
              <Link to={`/portfolio/${portfolio.id}/edit`}>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PortfolioCard;
