import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/(private)/components/app-sidebar';
import { SiteHeader } from '@/app/(private)/components/site-header';
import ClientAuthGuard from '@/app/(private)/components/client-auth-guard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientAuthGuard>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="@container/main bg-background grid-background py-8 px-4 lg:px-6 flex flex-1 flex-col gap-2">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ClientAuthGuard>
  );
}
