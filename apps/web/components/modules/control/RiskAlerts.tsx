import React from 'react';
import Link from 'next/link';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@nexfield/ui';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: string;
  fieldName?: string;
}

interface RiskAlertsProps {
  visibleAlerts: Alert[];
  dismissAlert: (id: string) => void;
}

export function RiskAlerts({ visibleAlerts, dismissAlert }: RiskAlertsProps) {
  return (
    <Card className="border-[#2E3F34]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Agronomic Risk Alerts
          </CardTitle>
          <Badge variant="warning" size="sm">
            {visibleAlerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleAlerts.length === 0 ? (
          <div className="p-4 rounded-lg bg-[#0E1511] text-center text-xs text-[#7B9586]">
            No active risk alerts at this holding.
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-lg bg-[#141B17] border border-[#23352A] p-3 text-xs space-y-2 relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-[#F1F6F3] pr-4">{alert.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dismissAlert(alert.id)}
                  className="h-5 w-5 text-[#637C6E] hover:text-[#E2ECE5] absolute top-2.5 right-2.5"
                  title="Dismiss alert"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-[#8FA597] leading-relaxed">{alert.message}</p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-[#637C6F] font-mono">
                  {alert.fieldName || 'Global Holding'}
                </span>
                <Link
                  href={alert.severity === 'warning' ? '/fieldsight' : '/markets'}
                  className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-[11px]"
                >
                  Investigate <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
