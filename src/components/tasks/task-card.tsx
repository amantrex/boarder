import type { Task } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowUp, ArrowDown, ChevronsRight, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { TaskForm } from './task-form';

const priorityConfig = {
  high: { label: 'High', icon: AlertTriangle, className: 'bg-red-500/20 text-red-700' },
  medium: { label: 'Medium', icon: ArrowUp, className: 'bg-yellow-500/20 text-yellow-700' },
  low: { label: 'Low', icon: ArrowDown, className: 'bg-blue-500/20 text-blue-700' },
};

interface TaskCardProps {
  task: Task;
  variant?: 'default' | 'kanban';
}

export function TaskCard({ task, variant = 'default' }: TaskCardProps) {
  const { label, icon: Icon, className } = priorityConfig[task.priority];

  return (
    <Card className={cn('brutalist-border flex flex-col', { 'mb-4': variant === 'kanban' })}>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base uppercase leading-tight">{task.title}</CardTitle>
          <Badge variant="outline" className="text-xs uppercase whitespace-nowrap">v{task.version}</Badge>
        </div>
        {variant === 'default' && task.accountName && (
          <CardDescription className="flex items-center pt-1">
            <ChevronsRight className="h-4 w-4 mr-1 text-muted-foreground" /> {task.accountName}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className='flex-grow'>
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        <div className="flex items-center justify-between text-xs">
          <Badge variant="secondary" className={cn("uppercase", className)}>
            <Icon className="mr-1 h-3 w-3" />
            {label}
          </Badge>
          <span className="text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
       <CardFooter>
        <TaskForm
          task={task}
          trigger={
            <Button variant="outline" className="w-full uppercase brutalist-border">
              <Edit className="mr-2 h-4 w-4" />
              Manage Task
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
