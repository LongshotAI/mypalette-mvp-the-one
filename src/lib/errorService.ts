// src/lib/services/errorService.ts
import { toast } from '@/hooks/use-toast';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorOptions {
  severity?: ErrorSeverity;
  context?: Record<string, unknown>;
  userMessage?: string;
  reportToService?: boolean;
}

export function handleError(error: unknown, options: ErrorOptions = {}) {
  const {
    severity = 'error',
    context = {},
    userMessage = 'An unexpected error occurred',
    reportToService = true
  } = options;
  
  // Format the error
  const formattedError = formatError(error);
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error(formattedError, context);
  }
  
  // Report to error service in production
  if (reportToService && import.meta.env.PROD) {
    // In the future, integrate with an error reporting service
    // Example: errorReportingService.captureException(formattedError, { severity, context });
  }
  
  // Show user message via toast
  toast({
    title: severity === 'critical' ? 'Critical Error' : 'Error',
    description: userMessage,
    variant: "destructive",
  });
  
  return { error: formattedError, userMessage };
}

export function formatError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('connection') ||
      error.message.includes('offline')
    );
  }
  return false;
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('auth') ||
      error.message.includes('authentication') ||
      error.message.includes('permission') ||
      error.message.includes('unauthorized')
    );
  }
  return false;
}
