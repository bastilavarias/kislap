'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserFormValues } from '@/lib/schemas/user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Mail, Phone, Github, Globe, Camera } from 'lucide-react';

export function SettingsForm() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      mobile_number: '',
      newsletter: false,
    },
  });

  useEffect(() => {
    async function loadUserData() {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();

        setUser(data);
        setImagePreview(data.image_url);
        form.reset({
          first_name: data.first_name,
          last_name: data.last_name,
          mobile_number: data.mobile_number || '',
          newsletter: Boolean(data.newsletter),
        });
      } catch (error) {
        toast.error('Failed to load user settings');
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Here you would typically upload the file to your API
      toast.info('Image preview updated locally.');
    }
  };

  async function onSubmit(values: UserFormValues) {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Update failed');
    }
  }

  if (loading) return <SettingsSkeleton />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Header & Avatar */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b">
          <div className="relative group">
            <Avatar className="w-24 h-24 border">
              <AvatarImage src={imagePreview || ''} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 h-8 text-xs"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Change Photo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <Card className="shadow-none border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-transparent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-transparent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                    Email (Locked)
                  </FormLabel>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-muted-foreground text-sm">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                        Mobile
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} className="bg-transparent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="shadow-none border-zinc-200 dark:border-zinc-800">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">Email Marketing</FormLabel>
                        <FormDescription className="text-xs">
                          Receive updates about new features.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Connected Accounts */}
            <Card className="shadow-none border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Connected Accounts</CardTitle>
                <CardDescription className="text-xs">
                  Log in providers linked to this account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </div>
                  {user?.github_id ? (
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400 font-medium">
                      CONNECTED
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">NOT LINKED</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4" />
                    <span>Google</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase">NOT LINKED</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(user?.updated_at).toLocaleDateString()}
          </p>
          <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-[120px]">
            {form.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-900" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 bg-zinc-100 dark:bg-zinc-900" />
          <Skeleton className="h-4 w-48 bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[300px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
        </div>
        <Skeleton className="h-[200px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
      </div>
    </div>
  );
}
