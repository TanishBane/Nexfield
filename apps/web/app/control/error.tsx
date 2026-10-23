'use client';

import { ErrorDisplay } from '@nexfield/ui';

export default function ControlError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-8">
      <ErrorDisplay
        title="Control Command Center Offline"
        message="Unable to establish real-time socket connection with the farm gateway telemetry hub."
        onRetry={reset}
      />
    </div>
  );
}
