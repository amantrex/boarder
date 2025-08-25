'use client';
import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListFilter, Search, X, Download } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { TaskCard } from '@/components/tasks/task-card';
import { useSearchParams } from 'next/navigation';
import type { Task, TaskStatus } from '@/lib/types';
import { isAfter, isBefore, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { exportToCsv } from '@/lib/csv-export';

type FilterType = 'account' | 'status' | 'dueDate' | 'accountManager';

export default function AllTasksPage() {
  const { accounts, tasks } = useAuth();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState<FilterType | ''>('');
  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = React.useState<TaskStatus[]>([]);
  const [selectedDueDate, setSelectedDueDate] = React.useState('');
  const [selectedManagers, setSelectedManagers] = React.useState<string[]>([]);

  // Initialize filters from URL params
  React.useEffect(() => {
    const statusParams = searchParams.getAll('status') as TaskStatus[];
    if (statusParams.length > 0) {
      setFilterType('status');
      setSelectedStatuses(statusParams);
    }
  }, [searchParams]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery((e.target as HTMLInputElement).value.toLowerCase());
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('');
    setSelectedAccounts([]);
    setSelectedStatuses([]);
    setSelectedDueDate('');
    setSelectedManagers([]);
  };

  const handleExport = () => {
    const dataToExport = tasks.map(task => ({
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description || '',
      taskStatus: task.status,
      taskPriority: task.priority,
      taskVersion: task.version,
      taskDueDate: new Date(task.dueDate).toLocaleDateString(),
      accountId: task.accountId,
      accountName: task.accountName || 'N/A',
    }));
    exportToCsv('all_tasks.csv', dataToExport);
  };

  const accountManagers = React.useMemo(() => {
    const managers = new Set(accounts.map(a => a.client));
    return Array.from(managers);
  }, [accounts]);

  const filteredTasks = React.useMemo(() => {
    let filtered = [...tasks];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery) ||
        (task.description && task.description.toLowerCase().includes(searchQuery)) ||
        (task.accountName && task.accountName.toLowerCase().includes(searchQuery))
      );
    }
    
    // Detailed filters
    switch (filterType) {
        case 'account':
            if (selectedAccounts.length > 0) {
                filtered = filtered.filter(task => selectedAccounts.includes(task.accountId));
            }
            break;
        case 'status':
            if (selectedStatuses.length > 0) {
                filtered = filtered.filter(task => selectedStatuses.includes(task.status));
            }
            break;
        case 'dueDate':
            const now = new Date();
            if (selectedDueDate === 'this_week') {
                const weekStart = startOfWeek(now);
                const weekEnd = endOfWeek(now);
                filtered = filtered.filter(task => task.dueDate && isAfter(new Date(task.dueDate), weekStart) && isBefore(new Date(task.dueDate), weekEnd));
            } else if (selectedDueDate === 'this_month') {
                const monthStart = startOfMonth(now);
                const monthEnd = endOfMonth(now);
                filtered = filtered.filter(task => task.dueDate && isAfter(new Date(task.dueDate), monthStart) && isBefore(new Date(task.dueDate), monthEnd));
            } else if (selectedDueDate === 'next_month') {
                const nextMonthStart = startOfMonth(addMonths(now, 1));
                const nextMonthEnd = endOfMonth(addMonths(now, 1));
                filtered = filtered.filter(task => task.dueDate && isAfter(new Date(task.dueDate), nextMonthStart) && isBefore(new Date(task.dueDate), nextMonthEnd));
            }
            break;
        case 'accountManager':
            if (selectedManagers.length > 0) {
                const accountIds = accounts.filter(acc => selectedManagers.includes(acc.client)).map(a => a.id);
                filtered = filtered.filter(task => accountIds.includes(task.accountId));
            }
            break;
        default:
            break;
    }

    return filtered;
  }, [tasks, searchQuery, filterType, selectedAccounts, selectedStatuses, selectedDueDate, selectedManagers, accounts]);

  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-1 md:p-4">
        <PageHeader title="All Tasks" subtitle="A comprehensive view of every task across all accounts.">
            <Button variant="outline" onClick={handleExport} className="brutalist-border">
                <Download className="mr-2 h-4 w-4" />
                Export All Tasks
            </Button>
        </PageHeader>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by name, description, or account..." 
                className="pl-10 brutalist-border focus:border-primary" 
                onKeyDown={handleSearch}
                defaultValue={searchQuery}
            />
          </div>
          
          <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType || '')}>
            <SelectTrigger className="w-full md:w-[180px] uppercase brutalist-border focus:border-primary">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="account">Account</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="accountManager">Account Manager</SelectItem>
            </SelectContent>
          </Select>
          
          {filterType === 'account' && (
            <Select onValueChange={(v) => setSelectedAccounts([v])}>
                 <SelectTrigger className="w-full md:w-[180px] uppercase brutalist-border focus:border-primary">
                    <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                    {accounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>)}
                </SelectContent>
            </Select>
          )}

          {filterType === 'status' && (
             <Select onValueChange={(v) => setSelectedStatuses([v as TaskStatus])}>
                <SelectTrigger className="w-full md:w-[180px] uppercase brutalist-border focus:border-primary">
                    <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                </SelectContent>
            </Select>
          )}

          {filterType === 'dueDate' && (
             <Select onValueChange={setSelectedDueDate}>
                <SelectTrigger className="w-full md:w-[180px] uppercase brutalist-border focus:border-primary">
                    <SelectValue placeholder="Select Due Date" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="this_week">Due This Week</SelectItem>
                    <SelectItem value="this_month">Due This Month</SelectItem>
                    <SelectItem value="next_month">Due Next Month</SelectItem>
                </SelectContent>
            </Select>
          )}

          {filterType === 'accountManager' && (
             <Select onValueChange={(v) => setSelectedManagers([v])}>
                <SelectTrigger className="w-full md:w-[180px] uppercase brutalist-border focus:border-primary">
                    <SelectValue placeholder="Select Manager" />
                </SelectTrigger>
                <SelectContent>
                    {accountManagers.map(manager => <SelectItem key={manager} value={manager}>{manager}</SelectItem>)}
                </SelectContent>
            </Select>
          )}

          <Button variant="outline" className="uppercase brutalist-border" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
