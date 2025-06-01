
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

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

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

const SearchFilters = ({ onFiltersChange, isLoading = false }: SearchFiltersProps) => {
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

  const mediumOptions = [
    'Digital Art', 'Photography', 'Painting', 'Sculpture', 'Mixed Media',
    '3D Art', 'Animation', 'Video Art', 'Installation', 'Performance'
  ];

  const styleOptions = [
    'Abstract', 'Realistic', 'Surreal', 'Minimalist', 'Pop Art',
    'Street Art', 'Contemporary', 'Classical', 'Experimental', 'Conceptual'
  ];

  const yearsActiveOptions = [
    '0-2', '3-5', '6-10', '11-15', '16-20', '20+'
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: 'artisticMedium' | 'artisticStyle', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
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

  const hasActiveFilters = filters.query || filters.artisticMedium.length > 0 || 
    filters.artisticStyle.length > 0 || filters.location || filters.yearsActive ||
    filters.availableForCommission !== null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Query */}
        <div>
          <Label htmlFor="search">Search Artists</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, username, or bio..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="grid grid-cols-2 gap-2">
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
                <SelectItem value="created_at">Join Date</SelectItem>
                <SelectItem value="first_name">Name</SelectItem>
                <SelectItem value="years_active">Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value: 'asc' | 'desc') => handleFilterChange('sortOrder', value)}
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

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </Button>

        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Artistic Medium */}
            <div>
              <Label>Artistic Medium</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {mediumOptions.map((medium) => (
                  <div key={medium} className="flex items-center space-x-2">
                    <Checkbox
                      id={`medium-${medium}`}
                      checked={filters.artisticMedium.includes(medium)}
                      onCheckedChange={() => handleArrayFilterChange('artisticMedium', medium)}
                    />
                    <Label htmlFor={`medium-${medium}`} className="text-sm">
                      {medium}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.artisticMedium.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.artisticMedium.map((medium) => (
                    <Badge key={medium} variant="secondary" className="text-xs">
                      {medium}
                      <button
                        onClick={() => handleArrayFilterChange('artisticMedium', medium)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Artistic Style */}
            <div>
              <Label>Artistic Style</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {styleOptions.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${style}`}
                      checked={filters.artisticStyle.includes(style)}
                      onCheckedChange={() => handleArrayFilterChange('artisticStyle', style)}
                    />
                    <Label htmlFor={`style-${style}`} className="text-sm">
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.artisticStyle.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.artisticStyle.map((style) => (
                    <Badge key={style} variant="secondary" className="text-xs">
                      {style}
                      <button
                        onClick={() => handleArrayFilterChange('artisticStyle', style)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter city or country..."
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
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Experience</SelectItem>
                  {yearsActiveOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Commission Availability */}
            <div>
              <Label>Commission Availability</Label>
              <Select
                value={filters.availableForCommission === null ? 'any' : filters.availableForCommission.toString()}
                onValueChange={(value) => 
                  handleFilterChange('availableForCommission', 
                    value === 'any' ? null : value === 'true'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="true">Available for Commission</SelectItem>
                  <SelectItem value="false">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
