import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background grid-background">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
