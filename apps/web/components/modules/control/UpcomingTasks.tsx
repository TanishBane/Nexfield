import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@nexfield/ui';

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  priority: string;
}

interface UpcomingTasksProps {
  recentTasks: Task[];
  completedTaskIds: string[];
  toggleTaskCompletion: (taskId: string) => void;
}

export function UpcomingTasks({ recentTasks, completedTaskIds, toggleTaskCompletion }: UpcomingTasksProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            Upcoming Tasks
          </CardTitle>
          <Link href="/ops" className="text-xs text-emerald-400 hover:underline">
            All Ops
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {recentTasks.slice(0, 3).map((task) => {
          const isCompleted = completedTaskIds.includes(task.id) || task.status === 'completed';
          return (
            <div
              key={task.id}
              onClick={() => toggleTaskCompletion(task.id)}
              className="flex items-start gap-2.5 rounded-lg bg-[#0E1511] border border-[#1E2E25] p-2.5 text-xs cursor-pointer hover:border-[#273B2F] transition-colors"
            >
              <button
                type="button"
                className="mt-0.5 text-emerald-400"
                title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-[#486354]" />
                )}
              </button>
              <div className="flex-1 overflow-hidden">
                <p
                  className={`font-medium truncate ${
                    isCompleted ? 'line-through text-[#637C6F]' : 'text-[#E3ECE6]'
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#789182] mt-0.5">
                  <span>Due: {task.dueDate}</span>
                  <span className="capitalize text-amber-300 font-mono">{task.priority}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
