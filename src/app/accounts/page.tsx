'use client';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, Download } from 'lucide-react';
import { AccountCard } from '@/components/accounts/account-card';
import { AccountForm } from '@/components/accounts/account-form';
import { useAuth } from '@/hooks/use-auth';
import { exportToCsv } from '@/lib/csv-export';

export default function AccountsPage() {
  const { accounts } = useAuth();

  const handleExport = () => {
    const dataToExport = accounts.map(({ id, name, client, status, performance, description, notes, lastModified }) => ({
      id,
      name,
      client,
      status,
      performance,
      description: description || '',
      notes: notes || '',
      lastModified: new Date(lastModified).toLocaleDateString(),
    }));
    exportToCsv('all_accounts.csv', dataToExport);
  };
  
  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-1 md:p-4">
        <PageHeader title="Accounts" subtitle="Manage all your client accounts.">
          <Button variant="outline" onClick={handleExport} className="brutalist-border">
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
          <AccountForm trigger={
            <Button className="uppercase brutalist-border">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Account
            </Button>
          } />
        </PageHeader>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search accounts..." className="pl-10 brutalist-border focus:border-primary" />
          </div>
          <Select>
            <SelectTrigger className="w-[180px] uppercase brutalist-border focus:border-primary">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {accounts.map(account => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
