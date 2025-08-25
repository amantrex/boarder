export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  client: string;
  status: 'active' | 'inactive';
  tasks: Task[];
  performance: number;
  description?: string;
  notes?: string;
  lastModified: string;
}

export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  version: number;
  accountId: string;
  accountName?: string;
  dueDate: string;
}
