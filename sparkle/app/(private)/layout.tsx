import { SiteHeader } from '@/app/(private)/components/site-header';
import ClientAuthGuard from '@/app/(private)/components/client-auth-guard';
import { AuthProvider } from '@/contexts/auth-context';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClientAuthGuard>
        <SiteHeader />
        <main className="bg-background grid-background py-8 px-4 lg:px-6 flex flex-1 flex-col gap-2">
          <div className="container mx-auto">{children}</div>
        </main>
      </ClientAuthGuard>
    </AuthProvider>
  );
}
