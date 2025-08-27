import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

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
