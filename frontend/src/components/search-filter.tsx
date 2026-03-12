import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { AssetType } from '../types/asset';

export interface SearchFilters {
  searchTerm: string;
  fileType: AssetType | 'all';
  sortBy: 'date-desc' | 'date-asc' | 'name' | 'size';
  tags: string[];
}

interface SearchFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableTags: string[];
}

export function SearchFilter({
  filters,
  onFiltersChange,
  availableTags,
}: SearchFilterProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleFileTypeChange = (value: string) => {
    onFiltersChange({ ...filters, fileType: value as AssetType | 'all' });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as SearchFilters['sortBy'],
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      fileType: 'all',
      sortBy: 'date-desc',
      tags: [],
    });
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.fileType !== 'all' ||
    filters.tags.length > 0 ||
    filters.sortBy !== 'date-desc';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filters.fileType} onValueChange={handleFileTypeChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="File Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="size">File Size</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Tags:</span>
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
