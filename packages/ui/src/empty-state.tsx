import React from "react";
import { cn } from "./utils";
import { Card, CardContent } from "./card";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn("border-dashed border-[#D1DDCD] bg-[#F7FAF2]", className)}
    >
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#D1DDCD] text-[#048547] mb-4 shadow-xs">
            {icon}
          </div>
        ) : null}
        <h4 className="text-base font-semibold text-[#09251A]">{title}</h4>
        <p className="mt-1.5 text-sm text-[#46604D] max-w-sm leading-relaxed">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
