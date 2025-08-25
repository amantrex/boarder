'use client';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { notFound, useRouter } from 'next/navigation';
import { KanbanBoard } from '@/components/accounts/kanban-board';
import { Button } from '@/components/ui/button';
import { AccountForm } from '@/components/accounts/account-form';
import { useAuth } from '@/hooks/use-auth';
import * as React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Download } from 'lucide-react';
import { exportToCsv } from '@/lib/csv-export';

export default function AccountDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const { id } = params;
  const { accounts, updateAccount, deleteAccount } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [account, setAccount] = React.useState(() => accounts.find(acc => acc.id === id));
  
  React.useEffect(() => {
    const foundAccount = accounts.find(acc => acc.id === id);
    setAccount(foundAccount);
  }, [id, accounts]);

  const handleStatusChange = (newStatus: boolean) => {
    if (account) {
      const updatedAccount = { ...account, status: newStatus ? 'active' : 'inactive' as 'active' | 'inactive' };
      updateAccount(updatedAccount);
      toast({
        title: 'Account Updated',
        description: `Account "${account.name}" has been set to ${newStatus ? 'Active' : 'Inactive'}.`,
      });
      router.refresh();
    }
  };

  const handleDelete = () => {
    if (account) {
      deleteAccount(account.id);
      toast({
        title: 'Account Deleted',
        description: `Account "${account.name}" has been deleted.`,
      });
      router.push('/accounts');
    }
  };

  const handleExport = () => {
    if (!account) return;

    let dataToExport = [];

    if (account.tasks && account.tasks.length > 0) {
        dataToExport = account.tasks.map(task => ({
            accountId: account.id,
            accountName: account.name,
            accountClient: account.client,
            accountStatus: account.status,
            taskId: task.id,
            taskTitle: task.title,
            taskDescription: task.description || '',
            taskStatus: task.status,
            taskPriority: task.priority,
            taskVersion: task.version,
            taskDueDate: new Date(task.dueDate).toLocaleDateString(),
        }));
    } else {
        dataToExport.push({
            accountId: account.id,
            accountName: account.name,
            accountClient: account.client,
            accountStatus: account.status,
            taskId: 'N/A',
            taskTitle: 'N/A',
            taskDescription: 'N/A',
            taskStatus: 'N/A',
            taskPriority: 'N/A',
            taskVersion: 'N/A',
            taskDueDate: 'N/A',
        });
    }

    exportToCsv(`account_${account.name.replace(/ /g, '_')}.csv`, dataToExport);
  };

  if (!account) {
    const accountExists = accounts.some(acc => acc.id === id);
    if (!accountExists) {
         notFound();
    }
    return null;
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-1 md:p-4">
        <PageHeader title={account.name} subtitle={`Client: ${account.client}`}>
            <Button variant="outline" onClick={handleExport} className="brutalist-border">
                <Download className="mr-2 h-4 w-4" />
                Export
            </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="account-status"
              checked={account.status === 'active'}
              onCheckedChange={handleStatusChange}
            />
            <Label htmlFor="account-status" className="uppercase">{account.status}</Label>
          </div>
           <AccountForm
              trigger={
                <Button className="uppercase brutalist-border">
                  Edit Account
                </Button>
              }
              account={account}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="uppercase brutalist-border">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the account
                    and all associated tasks.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </PageHeader>
        
        <div className="space-y-6 mb-8">
            <Card className="brutalist-border">
              <CardHeader>
                <CardTitle className="uppercase">Account Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{account.client}</p>
              </CardContent>
            </Card>
             <Card className="brutalist-border">
                <CardHeader>
                    <CardTitle className="uppercase">Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {account.description || 'No description for this account.'}
                    </p>
                </CardContent>
            </Card>
            <Card className="brutalist-border">
              <CardHeader>
                <CardTitle className="uppercase">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {account.notes || 'No notes for this account.'}
                </p>
              </CardContent>
            </Card>
          </div>

        <KanbanBoard tasks={account.tasks} />

      </div>
    </AppLayout>
  );
}
