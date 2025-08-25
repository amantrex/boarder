import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function StatCard({ title, value, icon: Icon, description, onClick, children }: StatCardProps) {
  return (
    <Card 
      className={cn('brutalist-border', onClick && 'cursor-pointer hover:bg-muted/50 transition-colors')}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {children}
      </CardContent>
    </Card>
  );
}
