'use client';

import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { ProfileForm } from '@/components/profile/profile-form';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  return (
    <AppLayout>
      <PageHeader 
        title="Profile Settings" 
        subtitle="Manage your account details and preferences." 
      />
      <div className="p-1">
        {isLoading || !user ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <ProfileForm user={user} />
        )}
      </div>
    </AppLayout>
  );
}
