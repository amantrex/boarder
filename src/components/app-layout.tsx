'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  LayoutDashboard,
  PanelLeft,
  Briefcase,
  ListTodo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/icons/logo';
import { UserNav } from '@/components/user-nav';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/accounts', icon: Briefcase, label: 'Accounts' },
  { href: '/tasks', icon: ListTodo, label: 'All Tasks' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NavContent = () => (
    <nav className="grid items-start gap-2 px-4 text-sm font-medium">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            pathname.startsWith(href)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard">
            <Logo className="text-foreground" />
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <NavContent />
        </div>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
               <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard">
                  <Logo className="text-foreground" />
                </Link>
              </div>
              <div className="py-4">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
          <div className="sm:flex-1"></div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}
