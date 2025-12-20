import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ClientAuthGuard from '@/components/client-auth-guard';
import { AuthProvider } from '@/contexts/auth-context';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClientAuthGuard>
        <Header />
        <main className="bg-background grid-background px-4 lg:px-6 flex flex-1 flex-col gap-2">
          <div className="container mx-auto">{children}</div>
        </main>
        <Footer />
      </ClientAuthGuard>
    </AuthProvider>
  );
}
