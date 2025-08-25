import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Account } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, FileText, HelpCircle, XCircle } from 'lucide-react';

const statusConfig = {
  active: {
    label: 'Active',
    icon: CheckCircle,
    className: 'bg-green-500/20 text-green-700 border-green-500/30',
  },
  inactive: {
    label: 'Inactive',
    icon: XCircle,
    className: 'bg-red-500/20 text-red-700 border-red-500/30',
  },
  default: {
    label: 'Unknown',
    icon: HelpCircle,
    className: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
  }
}

export function AccountCard({ account }: { account: Account }) {
  const config = statusConfig[account.status] || statusConfig.default;
  const { label, icon: Icon, className } = config;
  const openTasks = account.tasks.filter(t => t.status !== 'done').length;

  return (
    <Card className="brutalist-border flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="uppercase text-xl">{account.name}</CardTitle>
          <Badge variant="outline" className={cn("uppercase", className)}>
            <Icon className="mr-1 h-3 w-3" />
            {label}
          </Badge>
        </div>
        <CardDescription>Client: {account.client}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-sm text-muted-foreground">
          {openTasks} open task(s)
        </p>
        <p className="text-sm text-muted-foreground">
          Performance: {account.performance}%
        </p>
        {account.notes && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
                <FileText className="h-4 w-4" /> Notes added
            </p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full uppercase brutalist-border" variant="outline">
          <Link href={`/accounts/${account.id}`}>Manage Account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
