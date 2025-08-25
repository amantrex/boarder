'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import type { Account } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const taskSchema = z.object({
  id: z.string().optional(),
  accountId: z.string().optional(),
  accountName: z.string().optional(),
  title: z.string().min(1, 'Task description is required.'),
  description: z.string().default(""),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['todo', 'inprogress', 'done']).default('todo'),
  version: z.number().min(1).max(10).default(1),
  dueDate: z.string().min(1, 'Due date is required.'),
});

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required.'),
  client: z.string().min(1, 'Account manager is required.'),
  description: z.string().optional(),
  notes: z.string().optional(),
  tasks: z.array(taskSchema).max(10),
});

type AccountFormData = z.infer<typeof accountSchema>;

export function AccountForm({
  trigger,
  account,
}: {
  trigger: React.ReactNode;
  account?: Account;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { addAccount, updateAccount, deleteAccount } = useAuth();
  
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name || '',
      client: account?.client || '',
      description: account?.description || '',
      notes: account?.notes || '',
      tasks: account?.tasks.map(t => ({...t, dueDate: new Date(t.dueDate).toISOString().split('T')[0]})) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tasks',
  });

  const onSubmit = (data: AccountFormData) => {
    const accountId = account?.id || `acc-${Date.now()}`;
    const tasksWithIds = data.tasks.map((task, index) => ({
      ...task,
      id: task.id || `task-${Date.now()}-${index}`,
      accountId: accountId,
    }));

    if (account) {
      updateAccount({ ...account, ...data, tasks: tasksWithIds });
    } else {
      const newAccount = {
        name: data.name,
        client: data.client,
        description: data.description,
        notes: data.notes,
        tasks: tasksWithIds,
      };
      addAccount(newAccount);
    }
    
    toast({
      title: account ? 'Account Updated' : 'Account Created',
      description: `Account "${data.name}" has been successfully ${
        account ? 'updated' : 'created'
      }.`,
    });
    setIsOpen(false);
    router.refresh();
  };

  const handleDelete = () => {
    if (account) {
      deleteAccount(account.id);
      toast({
        title: 'Account Deleted',
        description: `Account "${account.name}" has been deleted.`,
      });
      setIsOpen(false);
      router.push('/accounts');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="uppercase">
            {account ? 'Edit Account' : 'New Account'}
          </DialogTitle>
          <DialogDescription>
            {account ? 'Edit the details of the existing account.' : 'Create a new client account and add initial tasks.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase'>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Innovate Corp" {...field} className='brutalist-border'/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase'>Account Manager</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Smith" {...field} className='brutalist-border' />
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
                    <FormLabel className='uppercase'>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add a short description of the account..." {...field} className='brutalist-border'/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase'>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any relevant notes here..." {...field} className='brutalist-border'/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
                <h3 className="text-lg font-semibold uppercase">Tasks</h3>
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border-2 border-dashed rounded-md space-y-4 relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => remove(index)}
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                        <FormField
                            control={form.control}
                            name={`tasks.${index}.title`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase'>Task Description</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Describe the task" {...field} className='brutalist-border' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                           <FormField
                                control={form.control}
                                name={`tasks.${index}.priority`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase'>Priority</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='brutalist-border'><SelectValue /></SelectTrigger>
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
                                name={`tasks.${index}.status`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase'>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='brutalist-border'><SelectValue /></SelectTrigger>
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
                                name={`tasks.${index}.version`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase'>Version</FormLabel>
                                    <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                                    <FormControl>
                                        <SelectTrigger className='brutalist-border'><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from({length: 10}, (_, i) => i + 1).map(v => (
                                            <SelectItem key={v} value={String(v)}>{v}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`tasks.${index}.dueDate`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase'>Due Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className='brutalist-border' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ))}
                 {fields.length < 10 && (
                     <Button
                        type="button"
                        variant="outline"
                        className="w-full brutalist-border"
                        onClick={() => append({ title: '', description: '', priority: 'medium', status: 'todo', version: 1, dueDate: '' })}
                        >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                 )}
            </div>

            <DialogFooter>
              {account && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" className='mr-auto'>
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this account and all of its tasks.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="uppercase brutalist-border">
                {account ? 'Save Changes' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
