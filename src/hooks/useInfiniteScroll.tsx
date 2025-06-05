
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  fetchMore: () => Promise<void>;
  hasMore: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({ 
  fetchMore, 
  hasMore, 
  threshold = 100 
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= 
      document.documentElement.offsetHeight - threshold &&
      hasMore &&
      !isFetching
    ) {
      setIsFetching(true);
      fetchMore().finally(() => setIsFetching(false));
    }
  }, [fetchMore, hasMore, isFetching, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isFetching };
};

export default useInfiniteScroll;
