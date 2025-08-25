'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { TaskCard } from '../tasks/task-card';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const priorityColors: { [key in Task['priority']]: string } = {
  high: 'bg-primary',
  medium: 'bg-yellow-500',
  low: 'bg-accent',
};

export function FullCalendar({ tasks }: { tasks: Task[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDayIndex = getDay(monthStart);

  const tasksForSelectedDay = selectedDate ? tasks.filter(task => isSameDay(new Date(task.dueDate), selectedDate)) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-2xl font-bold uppercase">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="brutalist-border" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="brutalist-border uppercase" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="icon" className="brutalist-border" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px border-l border-t brutalist-border bg-border overflow-hidden rounded-lg">
          {dayNames.map(day => (
            <div key={day} className="text-center font-bold uppercase py-2 bg-background text-sm">
              {day}
            </div>
          ))}

          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b bg-muted/30" />
          ))}

          {daysInMonth.map(day => {
            const tasksForDay = tasks.filter(task => isSameDay(new Date(task.dueDate), day));
            return (
              <div
                key={day.toString()}
                className={cn(
                  'relative h-28 border-r border-b bg-background p-2 cursor-pointer hover:bg-muted/50',
                  isToday(day) && 'bg-accent/20',
                  selectedDate && isSameDay(day, selectedDate) && 'ring-2 ring-primary ring-inset'
                )}
                onClick={() => setSelectedDate(day)}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')} className="font-semibold">
                  {format(day, 'd')}
                </time>
                <div className="mt-1 flex flex-col items-start gap-1">
                  {tasksForDay.slice(0, 3).map(task => (
                    <div key={task.id} className={cn('h-1.5 w-full rounded-full', priorityColors[task.priority])} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="font-headline text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-foreground">
          {selectedDate ? `Tasks for ${format(selectedDate, 'MMM d')}`: 'Select a date'}
        </h3>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {tasksForSelectedDay.length > 0 ? (
            tasksForSelectedDay.map(task => <TaskCard key={task.id} task={task} variant="kanban" />)
          ) : (
            <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border-2 border-dashed border-muted-foreground/50 rounded-md">
                {selectedDate ? 'No tasks scheduled' : 'Select a day to see tasks'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
