import type { Account, Task, User } from './types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatar: 'https://placehold.co/100x100',
};

const tasks: Task[] = [
  { id: 'task-1', accountId: 'acc-1', title: 'Initial Draft of Q3 Report', description: 'Compile all departmental data.', status: 'inprogress', priority: 'high', version: 3, dueDate: '2024-08-15' },
  { id: 'task-2', accountId: 'acc-1', title: 'Review Marketing Creatives', description: 'Provide feedback on the new ad campaign visuals.', status: 'todo', priority: 'medium', version: 1, dueDate: '2024-08-20' },
  { id: 'task-3', accountId: 'acc-2', title: 'Finalize Budget Allocation', description: 'Allocate funds for the next fiscal year.', status: 'done', priority: 'high', version: 7, dueDate: '2024-07-28' },
  { id: 'task-4', accountId: 'acc-2', title: 'Onboard New Hires', description: 'Prepare orientation materials.', status: 'todo', priority: 'low', version: 2, dueDate: '2024-09-01' },
  { id: 'task-5', accountId: 'acc-3', title: 'Develop API Endpoint', description: 'Create the new endpoint for user authentication.', status: 'inprogress', priority: 'high', version: 9, dueDate: '2024-08-10' },
  { id: 'task-6', accountId: 'acc-3', title: 'Fix UI Bugs on Dashboard', description: 'Resolve reported visual glitches.', status: 'done', priority: 'medium', version: 5, dueDate: '2024-08-05' },
  { id: 'task-7', accountId: 'acc-4', title: 'Client Follow-up Call', description: 'Discuss project milestones and deliverables.', status: 'todo', priority: 'high', version: 1, dueDate: '2024-08-08' },
];

export const mockAccounts: Account[] = [
  { id: 'acc-1', name: 'Innovate Corp', client: 'John Smith', status: 'active', tasks: [], performance: 92, notes: 'This is a key account. Focus on Q3 deliverables.', lastModified: new Date().toISOString() },
  { id: 'acc-2', name: 'Synergy Solutions', client: 'Jane Roe', status: 'active', tasks: [], performance: 88, notes: '', lastModified: new Date().toISOString() },
  { id: 'acc-3', name: 'Quantum Dynamics', client: 'Sam Wilson', status: 'inactive', tasks: [], performance: 76, notes: 'Account is currently on hold. Re-evaluate in Q4.', lastModified: new Date().toISOString() },
  { id: 'acc-4', name: 'Apex Enterprises', client: 'Maria Garcia', status: 'active', tasks: [], performance: 65, notes: 'Awaiting final contract signature.', lastModified: new Date().toISOString() },
]
  .map(acc => ({
    ...acc,
    status: acc.status as 'active' | 'inactive',
    tasks: tasks.filter(t => t.accountId === acc.id),
  }));

export const mockTasks: Task[] = tasks.map(task => {
  const account = mockAccounts.find(acc => acc.id === task.accountId);
  return { ...task, accountName: account?.name };
});
