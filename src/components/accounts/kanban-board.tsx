import type { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from '@/components/tasks/task-card';

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const tasksByStatus = columns.map(column => ({
    ...column,
    tasks: tasks.filter(task => task.status === column.id),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tasksByStatus.map(column => (
        <div key={column.id} className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-headline text-lg font-bold uppercase tracking-wider text-foreground mb-4 pb-2 border-b-2 border-foreground">
            {column.title} ({column.tasks.length})
          </h3>
          <div className="space-y-4">
            {column.tasks.length > 0 ? (
              column.tasks.map(task => <TaskCard key={task.id} task={task} variant="kanban" />)
            ) : (
              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border-2 border-dashed border-muted-foreground/50 rounded-md">
                No tasks
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
