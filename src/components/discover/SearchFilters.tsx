
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

export interface SearchFilters {
  query: string;
  artisticMedium: string[];
  artisticStyle: string[];
  location: string;
  yearsActive: string;
  availableForCommission: boolean | null;
  sortBy: string;
  sortOrder: string;
  selectedCategory?: string;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  isLoading: boolean;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onFiltersChange, 
  isLoading,
  selectedCategory = '',
  onCategoryChange 
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    artisticMedium: [],
    artisticStyle: [],
    location: '',
    yearsActive: '',
    availableForCommission: null,
    sortBy: 'created_at',
    sortOrder: 'desc',
    selectedCategory
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const mediumOptions = [
    'Digital Art', 'Photography', 'Painting', 'Sculpture', 'Mixed Media',
    'Video Art', '3D Art', 'Illustration', 'Graphic Design', 'Installation'
  ];

  const styleOptions = [
    'Abstract', 'Realistic', 'Minimalist', 'Surreal', 'Contemporary',
    'Pop Art', 'Street Art', 'Conceptual', 'Experimental', 'Traditional'
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleMediumToggle = (medium: string) => {
    const newMediums = filters.artisticMedium.includes(medium)
      ? filters.artisticMedium.filter(m => m !== medium)
      : [...filters.artisticMedium, medium];
    handleFilterChange('artisticMedium', newMediums);
  };

  const handleStyleToggle = (style: string) => {
    const newStyles = filters.artisticStyle.includes(style)
      ? filters.artisticStyle.filter(s => s !== style)
      : [...filters.artisticStyle, style];
    handleFilterChange('artisticStyle', newStyles);
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
      sortOrder: 'desc',
      selectedCategory: selectedCategory
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4" />
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Query */}
        <div>
          <Label htmlFor="search">Search Artists</Label>
          <Input
            id="search"
            placeholder="Search by name, style, medium..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
          />
        </div>

        {/* Category Selection */}
        {onCategoryChange && (
          <div>
            <Label>Category</Label>
            <Select 
              value={selectedCategory} 
              onValueChange={onCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="new">New Artists</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {isExpanded && (
          <>
            {/* Artistic Medium */}
            <div>
              <Label>Artistic Medium</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {mediumOptions.map((medium) => (
                  <div key={medium} className="flex items-center space-x-2">
                    <Checkbox
                      id={medium}
                      checked={filters.artisticMedium.includes(medium)}
                      onCheckedChange={() => handleMediumToggle(medium)}
                    />
                    <Label htmlFor={medium} className="text-sm">
                      {medium}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Artistic Style */}
            <div>
              <Label>Artistic Style</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {styleOptions.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={style}
                      checked={filters.artisticStyle.includes(style)}
                      onCheckedChange={() => handleStyleToggle(style)}
                    />
                    <Label htmlFor={style} className="text-sm">
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State, Country"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            {/* Years Active */}
            <div>
              <Label>Years Active</Label>
              <Select 
                value={filters.yearsActive} 
                onValueChange={(value) => handleFilterChange('yearsActive', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="4-7">4-7 years</SelectItem>
                  <SelectItem value="8-15">8-15 years</SelectItem>
                  <SelectItem value="15+">15+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Available for Commission */}
            <div>
              <Label>Commission Status</Label>
              <Select 
                value={filters.availableForCommission === null ? '' : filters.availableForCommission.toString()} 
                onValueChange={(value) => handleFilterChange('availableForCommission', value === '' ? null : value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort By</Label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Joined</SelectItem>
                    <SelectItem value="username">Name</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Order</Label>
                <Select 
                  value={filters.sortOrder} 
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
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
          </>
        )}

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
