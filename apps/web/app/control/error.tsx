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
        message="The optional backend is unavailable. This public demo is continuing with synthetic agronomic fixtures and browser-local state."
        onRetry={reset}
      />
    </div>
  );
}
