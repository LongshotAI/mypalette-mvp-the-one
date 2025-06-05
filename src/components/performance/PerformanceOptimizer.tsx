
import React, { memo, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  dependencies?: any[];
  fallback?: React.ComponentType<{ error: Error }>;
}

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
    <h3 className="text-red-800 font-medium">Something went wrong</h3>
    <p className="text-red-600 text-sm mt-1">{error.message}</p>
  </div>
);

const PerformanceOptimizer = memo(({ 
  children, 
  dependencies = [], 
  fallback: FallbackComponent = ErrorFallback 
}: PerformanceOptimizerProps) => {
  const memoizedChildren = useMemo(() => children, dependencies);
  
  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={(error, errorInfo) => {
        console.error('Performance Optimizer Error:', error, errorInfo);
      }}
    >
      {memoizedChildren}
    </ErrorBoundary>
  );
});

PerformanceOptimizer.displayName = 'PerformanceOptimizer';

export default PerformanceOptimizer;

// Hook for debouncing values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttling functions
export const useThrottle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  const throttledFunc = React.useRef<T>();
  const lastRan = React.useRef<number>(Date.now());

  throttledFunc.current = React.useMemo(
    () =>
      ((...args: Parameters<T>) => {
        if (Date.now() - lastRan.current >= delay) {
          func(...args);
          lastRan.current = Date.now();
        }
      }) as T,
    [func, delay]
  );

  return throttledFunc.current;
};

// Virtual scrolling component for large lists
export const VirtualList = memo(({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem 
}: {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
});

VirtualList.displayName = 'VirtualList';
