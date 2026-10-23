import React from 'react';
import { cn } from './utils';
import { Card, CardContent } from './card';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed border-[#24352B] bg-[#0E1411]', className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16221B] border border-[#23352A] text-[#71897C] mb-4">
            {icon}
          </div>
        ) : null}
        <h4 className="text-base font-semibold text-[#E2EBE5]">{title}</h4>
        <p className="mt-1 text-sm text-[#849B8E] max-w-sm">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
