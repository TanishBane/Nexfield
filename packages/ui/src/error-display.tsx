import React from 'react';
import { cn } from './utils';
import { Card, CardContent } from './card';
import { Button } from './button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title = 'System Telemetry Error',
  message = 'An unexpected error occurred while communicating with the agricultural engine.',
  onRetry,
  className,
}: ErrorDisplayProps) {
  return (
    <Card className={cn('border-rose-900/50 bg-[#150E10]', className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-rose-200">{title}</h4>
        <p className="mt-1 text-sm text-[#A88C90] max-w-md">{message}</p>
        {onRetry ? (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-5 border-rose-800/60 text-rose-200 hover:bg-rose-950/50 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
