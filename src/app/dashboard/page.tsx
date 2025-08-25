'use client';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Briefcase, ListTodo, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { accounts, tasks } = useAuth();
  const router = useRouter();

  const totalAccounts = accounts.length;
  const openTasks = tasks.filter(t => t.status !== 'done').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const lastModifiedAccounts = [...accounts]
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 3);

  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-1 md:p-4">
        <PageHeader title="Dashboard" subtitle="An overview of your accounts and tasks." />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Accounts" 
            value={totalAccounts} 
            icon={Briefcase} 
            description="All managed accounts" 
            onClick={() => router.push('/accounts')}
            />
          <StatCard 
            title="Open Tasks" 
            value={openTasks} 
            icon={ListTodo} 
            description="Tasks requiring action" 
            onClick={() => router.push('/tasks?status=todo&status=inprogress')}
          />
          <StatCard 
            title="Completed Tasks" 
            value={completedTasks} 
            icon={CheckCircle} 
            description="Finished tasks" 
            onClick={() => router.push('/tasks?status=done')}
            />
          <StatCard 
            title="Progress" 
            value={`${progress}%`} 
            icon={TrendingUp} 
            description={`${completedTasks} of ${totalTasks} tasks completed`}
          >
             <Progress value={progress} className="mt-2 h-2" />
          </StatCard>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold uppercase tracking-wider text-foreground mb-4">
            Last Modified Accounts
          </h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {lastModifiedAccounts.map(account => (
              <Card key={account.id} className="brutalist-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="uppercase text-lg">{account.name}</CardTitle>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://placehold.co/100x100?text=${account.name.charAt(0)}`} data-ai-hint="logo company" />
                      <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardDescription>{account.client}</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-xs text-muted-foreground mt-2">
                    {new Date(account.lastModified).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {account.tasks.filter(t => t.status !== 'done').length} open tasks
                  </p>
                  <Button asChild variant="outline" className="w-full mt-4 brutalist-border">
                    <Link href={`/accounts/${account.id}`}>
                      View Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
