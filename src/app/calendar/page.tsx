'use client';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { FullCalendar } from '@/components/calendar/full-calendar';
import { useAuth } from '@/hooks/use-auth';

export default function CalendarPage() {
  const { tasks } = useAuth();
  
  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-1 md:p-4">
        <PageHeader title="Calendar" subtitle="Visualize your tasks and deadlines." />
        <FullCalendar tasks={tasks} />
      </div>
    </AppLayout>
  );
}
