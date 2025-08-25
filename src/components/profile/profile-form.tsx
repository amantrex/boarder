'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { User } from '@/lib/types';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  avatar: z.instanceof(File).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm({ user }: { user: User }) {
  const { toast } = useToast();
  const { updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(user.avatar);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateUserProfile(data.name, data.avatar || null);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your profile. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md">
        <div className="flex items-center space-x-6">
            <div className="relative">
                <Image
                    src={preview || '/default-avatar.png'}
                    alt="Avatar preview"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
            </div>
            <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="uppercase cursor-pointer text-primary hover:underline">Change Avatar</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="avatar-upload"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='uppercase'>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} className='brutalist-border'/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="uppercase brutalist-border">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
      </form>
    </Form>
  );
}
