
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, X } from 'lucide-react';
import { useAdvancedSearch, AdvancedSearchFilters } from '@/hooks/useAdvancedSearch';

interface AdvancedSearchDialogProps {
  onSearch: (results: any[]) => void;
}

const AdvancedSearchDialog = ({ onSearch }: AdvancedSearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const { filters, setFilters, filterOptions, performSearch, isSearching } = useAdvancedSearch();

  const handleSearch = async () => {
    const results = await performSearch();
    onSearch(results);
    setOpen(false);
  };

  const updateFilter = (key: keyof AdvancedSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'artisticMediums' | 'artisticStyles' | 'locations', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      artisticMediums: [],
      artisticStyles: [],
      locations: [],
      yearRange: [1900, new Date().getFullYear()],
      availableForCommission: null,
      portfolioType: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </DialogTitle>
          <DialogDescription>
            Refine your search with detailed filters
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Search Query */}
            <div className="space-y-2">
              <Label htmlFor="query">Search Query</Label>
              <Input
                id="query"
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                placeholder="Search artists, portfolios, or keywords..."
              />
            </div>

            {/* Artistic Mediums */}
            <div className="space-y-3">
              <Label>Artistic Mediums</Label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.artisticMediums.map((medium) => (
                  <Badge
                    key={medium}
                    variant={filters.artisticMediums.includes(medium) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter('artisticMediums', medium)}
                  >
                    {medium}
                    {filters.artisticMediums.includes(medium) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Artistic Styles */}
            <div className="space-y-3">
              <Label>Artistic Styles</Label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.artisticStyles.map((style) => (
                  <Badge
                    key={style}
                    variant={filters.artisticStyles.includes(style) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter('artisticStyles', style)}
                  >
                    {style}
                    {filters.artisticStyles.includes(style) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-3">
              <Label>Locations</Label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.locations.map((location) => (
                  <Badge
                    key={location}
                    variant={filters.locations.includes(location) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter('locations', location)}
                  >
                    {location}
                    {filters.locations.includes(location) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Year Range */}
            <div className="space-y-3">
              <Label>Years Active Range</Label>
              <div className="px-3">
                <Slider
                  min={1900}
                  max={new Date().getFullYear()}
                  step={1}
                  value={filters.yearRange}
                  onValueChange={(value) => updateFilter('yearRange', value as [number, number])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{filters.yearRange[0]}</span>
                  <span>{filters.yearRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Available for Commission */}
            <div className="space-y-3">
              <Label>Commission Availability</Label>
              <Select
                value={filters.availableForCommission === null ? 'all' : filters.availableForCommission.toString()}
                onValueChange={(value) => updateFilter('availableForCommission', 
                  value === 'all' ? null : value === 'true'
                )}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Artists</SelectItem>
                  <SelectItem value="true">Available for Commission</SelectItem>
                  <SelectItem value="false">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Clear Filters
          </Button>
          <Button onClick={handleSearch} disabled={isSearching} className="flex-1">
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchDialog;
