'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Task description is required.'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'inprogress', 'done']),
  version: z.number().min(1).max(10),
  dueDate: z.string().min(1, 'Due date is required.'),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskForm({
  trigger,
  task,
}: {
  trigger: React.ReactNode;
  task: Task;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { updateTask, deleteTask } = useAuth();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      ...task,
      description: task.description || '',
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: TaskFormData) => {
    updateTask({ ...task, ...data });
    toast({
      title: 'Task Updated',
      description: `Task "${data.title}" has been successfully updated.`,
    });
    setIsOpen(false);
    router.refresh();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast({
        title: "Task Deleted",
        description: `Task "${task.title}" has been deleted.`,
    });
    setIsOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="uppercase">Edit Task</DialogTitle>
           <DialogDescription>
            Modify the details of this task.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase">Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Task title" {...field} className="brutalist-border"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase">Task Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the task" {...field} className="brutalist-border"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="brutalist-border">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="brutalist-border">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="inprogress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">Version</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(parseInt(v))}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="brutalist-border">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                            <SelectItem key={v} value={String(v)}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="brutalist-border"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" className='mr-auto'>
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete Task
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="uppercase brutalist-border">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
