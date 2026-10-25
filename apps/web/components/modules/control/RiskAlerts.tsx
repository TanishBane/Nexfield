import React from "react";
import Link from "next/link";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from "@nexfield/ui";

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
    <Card className="border-[#D1DDCD]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            Agronomic Risk Alerts
          </CardTitle>
          <Badge variant="warning" size="sm">
            {visibleAlerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleAlerts.length === 0 ? (
          <div className="p-4 rounded-lg bg-[#F7FAF2] text-center text-xs text-[#46604D]">
            No active risk alerts at this holding.
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] p-3 text-xs space-y-2 relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-[#09251A] pr-4">
                  {alert.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dismissAlert(alert.id)}
                  className="h-5 w-5 text-[#46604D] hover:text-[#09251A] absolute top-2.5 right-2.5"
                  title="Dismiss alert"
                  aria-label="Dismiss alert"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-[#46604D] leading-relaxed">{alert.message}</p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-[#46604D] font-mono">
                  {alert.fieldName || "Global Holding"}
                </span>
                <Link
                  href={
                    alert.severity === "warning" ? "/fieldsight" : "/markets"
                  }
                  className="text-emerald-700 hover:text-emerald-700 font-medium inline-flex items-center gap-1 text-[11px]"
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
