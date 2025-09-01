import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/app/(public)/components/hero";
import { Features } from "@/app/(public)/components/features";
import { Testimonials } from "@/app/(public)/components/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-background grid-background">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
