import React from "react";
import { Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@nexfield/ui";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  fieldName?: string;
  operatorName?: string;
}

interface ActivityTimelineProps {
  activityTimeline: ActivityItem[];
}

export function ActivityTimeline({ activityTimeline }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-700" />
          Farm Activity Timeline
        </CardTitle>
        <CardDescription>
          Auditable log of field machinery passes, agronomic spraying, and
          sampling events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activityTimeline.map((item) => (
          <div
            key={item.id}
            className="relative pl-6 pb-3 border-l-2 border-[#D1DDCD] last:pb-0 text-xs space-y-1"
          >
            <div className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-emerald-500/80 border-2 border-[#D1DDCD]" />
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#09251A]">{item.title}</span>
              <span className="text-[#46604D] font-mono">
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-[#46604D]">{item.description}</p>
            <div className="text-[10px] text-[#46604D] font-mono flex items-center gap-3">
              {item.fieldName ? <span>Parcel: {item.fieldName}</span> : null}
              {item.operatorName ? (
                <span>Operator: {item.operatorName}</span>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
