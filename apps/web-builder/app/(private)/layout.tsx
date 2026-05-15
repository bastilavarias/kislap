import ClientAuthGuard from '@/components/client-auth-guard';
import { AuthProvider } from '@/contexts/auth-context';
import { Header } from '@/components/header';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <ClientAuthGuard>
          <Header />
          <main className="grid-background flex flex-1 flex-col gap-2 bg-secondary/20 px-4 py-8 lg:px-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </ClientAuthGuard>
      </Suspense>
    </AuthProvider>
  );
}
