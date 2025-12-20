'use client';

import { useEffect, useState, useRef, use } from 'react';
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
import { Loader2, Github, Globe, Camera, CheckCircle2, CircleOff, LinkIcon } from 'lucide-react';
import { useAuth } from '@/hooks/api/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SettingsForm() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { authUser } = useAuth();

  const form = useForm<UserFormValues>({
    // @ts-ignore
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      newsletter: false,
    },
  });

  useEffect(() => {
    if (authUser) {
      form.setValue('first_name', authUser.first_name);
      form.setValue('last_name', authUser.last_name);
      form.setValue('email', authUser.email);
      form.setValue('mobile_number', authUser.mobile_number);
      form.setValue('newsletter', authUser.newsletter);
      setUser(authUser);
      setImagePreview(authUser?.image_url);
      setLoading(false);
    }
  }, [authUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                          Email (Locked)
                        </FormLabel>

                        <FormControl>
                          <Input {...field} readOnly className="cursor-not-allowed" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>

                <Card className="shadow-none border-zinc-200 dark:border-zinc-800">
                  <CardContent>
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
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="shadow-none border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Connected Accounts</CardTitle>
                <CardDescription className="text-xs">
                  Manage the providers linked to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                      <Github className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">GitHub</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Authentication</span>
                    </div>
                  </div>

                  {user?.github ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      LINKED
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-2 rounded-full">
                      <LinkIcon className="w-3 h-3" />
                      Connect
                    </Button>
                  )}
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

                {/* Google Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">Google</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Authentication</span>
                    </div>
                  </div>

                  {user?.google ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      LINKED
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      <CircleOff className="w-3 h-3" />
                      NOT LINKED
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(user?.updated_at).toLocaleDateString()}{' '}
            {new Date(user?.updated_at).toLocaleTimeString()}
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button type="submit" disabled className="min-w-[120px]">
                    {form.formState.isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </span>
              </TooltipTrigger>

              <TooltipContent>
                <p>This feature is underway!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
