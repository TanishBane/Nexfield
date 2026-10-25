import React from "react";
import { cn } from "./utils";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title = "System Telemetry Error",
  message = "An unexpected error occurred while communicating with the agricultural engine.",
  onRetry,
  className,
}: ErrorDisplayProps) {
  return (
    <Card className={cn("border-[#E9B4C4] bg-[#FBE0E8]/40", className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBE0E8] border border-[#E9B4C4] text-[#991B1B] mb-4 shadow-xs">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-[#991B1B]">{title}</h4>
        <p className="mt-1.5 text-sm text-[#46604D] max-w-md leading-relaxed">{message}</p>
        {onRetry ? (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-5 border-[#E9B4C4] text-[#991B1B] hover:bg-[#FBE0E8] gap-2 min-h-[44px]"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
