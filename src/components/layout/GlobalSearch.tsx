
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Briefcase } from 'lucide-react';
import SearchCommand from '@/components/discover/SearchCommand';

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground w-full sm:w-auto justify-start sm:justify-center"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search portfolios & calls</span>
        <span className="sm:hidden">Search</span>
        <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <SearchCommand open={open} onOpenChange={setOpen} />
    </>
  );
};

export default GlobalSearch;
