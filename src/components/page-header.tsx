import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-8 border-b-2 border-foreground pb-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider text-foreground md:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
