import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps extends React.ComponentProps<typeof Card> {
  mobileFullWidth?: boolean;
  tabletOptimized?: boolean;
}

const ResponsiveCard = ({ 
  children, 
  className,
  mobileFullWidth = true,
  tabletOptimized = true,
  ...props 
}: ResponsiveCardProps) => {
  return (
    <Card 
      className={cn(
        // Mobile optimizations
        mobileFullWidth && "w-full",
        "min-h-0 overflow-hidden",
        // Touch-friendly padding
        "p-4 sm:p-6",
        // Responsive shadows
        "shadow-sm hover:shadow-md sm:shadow-md sm:hover:shadow-lg",
        // Tablet optimizations
        tabletOptimized && "md:max-w-none",
        // Smooth transitions
        "transition-all duration-200 ease-in-out",
        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

export default ResponsiveCard;