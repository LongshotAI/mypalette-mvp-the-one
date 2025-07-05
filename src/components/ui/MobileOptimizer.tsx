import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizerProps {
  children: React.ReactNode;
  className?: string;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
}

const MobileOptimizer = ({ 
  children, 
  className,
  mobileBreakpoint = 'md' 
}: MobileOptimizerProps) => {
  return (
    <div className={cn(
      // Base mobile-first design
      "w-full min-h-0",
      // Responsive spacing
      "px-4 sm:px-6 lg:px-8",
      "py-4 sm:py-6 lg:py-8",
      // Responsive text sizing
      "text-sm sm:text-base",
      // Responsive grid behavior
      "space-y-4 sm:space-y-6",
      // Touch-friendly
      "touch-manipulation",
      // Performance optimizations
      "will-change-transform",
      // Custom classes
      className
    )}>
      {children}
    </div>
  );
};

export default MobileOptimizer;