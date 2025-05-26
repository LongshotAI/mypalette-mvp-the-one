
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export interface SearchFilters {
  query: string;
  artisticMedium: string[];
  artisticStyle: string[];
  location: string;
  yearsActive: string;
  availableForCommission: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const artisticMediums = [
  'Digital Art', 'Photography', 'Painting', 'Sculpture', '3D Modeling',
  'Animation', 'Illustration', 'Mixed Media', 'NFT Art', 'Video Art'
];

const artisticStyles = [
  'Abstract', 'Realistic', 'Surreal', 'Minimalist', 'Pop Art',
  'Contemporary', 'Traditional', 'Experimental', 'Conceptual', 'Street Art'
];

const SearchFilters = ({ onFiltersChange, isLoading }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    artisticMedium: [],
    artisticStyle: [],
    location: '',
    yearsActive: '',
    availableForCommission: null,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      artisticMedium: [],
      artisticStyle: [],
      location: '',
      yearsActive: '',
      availableForCommission: null,
      sortBy: 'created_at',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleMedium = (medium: string) => {
    const newMediums = filters.artisticMedium.includes(medium)
      ? filters.artisticMedium.filter(m => m !== medium)
      : [...filters.artisticMedium, medium];
    updateFilters({ artisticMedium: newMediums });
  };

  const toggleStyle = (style: string) => {
    const newStyles = filters.artisticStyle.includes(style)
      ? filters.artisticStyle.filter(s => s !== style)
      : [...filters.artisticStyle, style];
    updateFilters({ artisticStyle: newStyles });
  };

  const hasActiveFilters = filters.query || 
    filters.artisticMedium.length > 0 || 
    filters.artisticStyle.length > 0 || 
    filters.location || 
    filters.yearsActive || 
    filters.availableForCommission !== null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-1" />
              {showAdvanced ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Query */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artists, portfolios, or styles..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {artisticMediums.slice(0, 6).map((medium) => (
            <Badge
              key={medium}
              variant={filters.artisticMedium.includes(medium) ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => toggleMedium(medium)}
            >
              {medium}
            </Badge>
          ))}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t pt-4"
            >
              {/* Artistic Medium */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Artistic Medium</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {artisticMediums.map((medium) => (
                    <div key={medium} className="flex items-center space-x-2">
                      <Checkbox
                        id={`medium-${medium}`}
                        checked={filters.artisticMedium.includes(medium)}
                        onCheckedChange={() => toggleMedium(medium)}
                      />
                      <Label
                        htmlFor={`medium-${medium}`}
                        className="text-sm cursor-pointer"
                      >
                        {medium}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artistic Style */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Artistic Style</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {artisticStyles.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={`style-${style}`}
                        checked={filters.artisticStyle.includes(style)}
                        onCheckedChange={() => toggleStyle(style)}
                      />
                      <Label
                        htmlFor={`style-${style}`}
                        className="text-sm cursor-pointer"
                      >
                        {style}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location and Years Active */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State, Country"
                    value={filters.location}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="years-active" className="text-sm font-medium">Years Active</Label>
                  <Select
                    value={filters.yearsActive}
                    onValueChange={(value) => updateFilters({ yearsActive: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Commission Availability */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="commission-available"
                  checked={filters.availableForCommission === true}
                  onCheckedChange={(checked) => 
                    updateFilters({ availableForCommission: checked ? true : null })
                  }
                />
                <Label htmlFor="commission-available" className="text-sm">
                  Available for Commission
                </Label>
              </div>

              {/* Sort Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort-by" className="text-sm font-medium">Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilters({ sortBy: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date Joined</SelectItem>
                      <SelectItem value="updated_at">Last Active</SelectItem>
                      <SelectItem value="portfolio_count">Portfolio Count</SelectItem>
                      <SelectItem value="follower_count">Followers</SelectItem>
                      <SelectItem value="username">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort-order" className="text-sm font-medium">Order</Label>
                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value: 'asc' | 'desc') => updateFilters({ sortOrder: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
