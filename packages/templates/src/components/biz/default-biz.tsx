"use client";

import { useMemo, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  Loader2,
  ArrowRight,
  Menu,
  X,
  ShoppingBag,
  Star,
  ChevronDown,
} from "lucide-react";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Mode } from "@/contexts/settings-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// --- Types (Same as before) ---
interface BizService {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  image_url: string | null;
  is_featured: boolean;
}

interface BizProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  is_active: boolean;
  image_url: string | null;
}

interface BizTestimonial {
  id: number;
  author: string;
  content: string | null;
  rating: number;
  avatar_url: string | null;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface BizData {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  services_enabled: boolean;
  products_enabled: boolean;
  booking_enabled: boolean;
  ordering_enabled: boolean;
  services: BizService[];
  products: BizProduct[];
  testimonials: BizTestimonial[];
  social_links: SocialLink[];
}

interface Props {
  biz: BizData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

// --- High Quality Placeholders (Japanese Bakery Style) ---
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1612203985729-70726954388c?q=80&w=2000&auto=format&fit=crop", // Soft japanese cheesecake style
  texture: "https://www.transparenttextures.com/patterns/snow.png",
  fallback_product:
    "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop",
  fallback_avatar:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop",
  story:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop", // Baker working
};

// --- Smooth Scroll Helper ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// --- Components ---

const Navbar = ({
  biz,
  themeMode,
  onSetThemeMode,
}: {
  biz: BizData;
  themeMode: Mode;
  onSetThemeMode: any;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDarkMode = themeMode === "dark";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <button
      onClick={() => {
        scrollToSection(to);
        setMobileMenuOpen(false);
      }}
      className="text-sm font-medium tracking-wide hover:text-primary transition-colors uppercase"
    >
      {label}
    </button>
  );

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out px-6 md:px-12",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-8",
      )}
    >
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => scrollToSection("home")}
          className="text-2xl font-bold tracking-tighter font-serif z-50 relative"
        >
          {biz.name}
          <span className="text-primary text-4xl leading-none">.</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="products" label="Signatures" />
          <NavLink to="about" label="Our Story" />
          <NavLink to="reviews" label="Reviews" />
          <NavLink to="contact" label="Visit Us" />
          <ThemeSwitchToggle
            isDarkMode={isDarkMode}
            onSetThemeMode={onSetThemeMode}
          />
          {biz.ordering_enabled && (
            <Button className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90 font-medium tracking-wide">
              Order Online
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4 z-50">
          <ThemeSwitchToggle
            isDarkMode={isDarkMode}
            onSetThemeMode={onSetThemeMode}
          />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 h-screen bg-background flex flex-col items-center justify-center gap-8 md:hidden z-40"
          >
            <NavLink to="products" label="Signatures" />
            <NavLink to="about" label="Our Story" />
            <NavLink to="reviews" label="Reviews" />
            <NavLink to="contact" label="Visit Us" />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ biz }: { biz: BizData }) => {
  return (
    <section
      id="home"
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax-like feel */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="Hero"
          className="w-full h-full object-cover opacity-90 brightness-[0.85] scale-105"
        />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <p className="text-sm md:text-base tracking-[0.3em] uppercase opacity-90 font-medium">
          {biz.tagline || "Authentic Japanese Bakery"}
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light tracking-tight leading-none">
          {biz.name}
        </h1>
        <p className="text-lg md:text-xl font-light opacity-90 max-w-xl mx-auto leading-relaxed">
          {biz.description || "Handcrafted daily with premium ingredients."}
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => scrollToSection("products")}
            size="lg"
            className="h-14 px-10 bg-white text-black hover:bg-white/90 rounded-full text-base tracking-wide"
          >
            View Menu
          </Button>
          <Button
            onClick={() => scrollToSection("contact")}
            size="lg"
            variant="outline"
            className="h-14 px-10 border-white text-white hover:bg-white/10 rounded-full text-base tracking-wide bg-transparent"
          >
            Find a Store
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="w-8 h-8 opacity-70" />
      </div>
    </section>
  );
};

const ProductGrid = ({ products }: { products: BizProduct[] }) => {
  if (!products || products.length === 0) return null;

  return (
    <section
      id="products"
      className="py-24 md:py-32 px-6 md:px-12 bg-background"
    >
      <div className="max-w-screen-2xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-medium">
            Signatures
          </h2>
          <div className="w-px h-16 bg-primary mx-auto opacity-50"></div>
          <p className="text-muted-foreground tracking-wide uppercase text-sm">
            Freshly Baked • Premium Ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer space-y-6">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
                <img
                  src={product.image_url || IMAGES.fallback_product}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Minimal Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black rounded-full"
                  >
                    View Details
                  </Button>
                </div>

                {product.stock === 0 && (
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-xs uppercase tracking-widest font-bold">
                    Sold Out
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium font-serif group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm font-light line-clamp-2 px-4">
                  {product.description || "A delightful treat made with care."}
                </p>
                <p className="text-lg font-medium pt-2">${product.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button
            variant="link"
            className="text-lg text-muted-foreground hover:text-primary tracking-widest uppercase"
          >
            View Full Menu <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const AboutSection = ({ biz }: { biz: BizData }) => {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[3/4] lg:aspect-square overflow-hidden">
          <img
            src={IMAGES.story}
            alt="Our Chef"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>

        <div className="space-y-8 lg:pl-12">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
            The Philosophy
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light leading-[1.1]">
            Simple.
            <br />
            Honest.
            <br />
            Delicious.
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed max-w-lg">
            <p>
              At {biz.name}, we believe that baking is an act of love. We don't
              take shortcuts. Every loaf, every pastry, and every cake is
              crafted by hand using time-honored traditions.
            </p>
            <p>{biz.description}</p>
          </div>

          {/* Signature or Stats */}
          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-primary/20">
            <div>
              <p className="text-4xl font-serif">24h</p>
              <p className="text-xs uppercase tracking-wider mt-2 opacity-60">
                Fermentation
              </p>
            </div>
            <div>
              <p className="text-4xl font-serif">100%</p>
              <p className="text-xs uppercase tracking-wider mt-2 opacity-60">
                Natural
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewsSection = ({
  testimonials,
}: {
  testimonials: BizTestimonial[];
}) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="reviews" className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-16">
        <h2 className="text-3xl font-serif italic text-muted-foreground">
          "Words from our community"
        </h2>

        <div className="grid gap-12">
          {testimonials.slice(0, 3).map((t) => (
            <div
              key={t.id}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <div className="flex justify-center gap-1 text-primary/60">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-2xl md:text-4xl font-light leading-tight">
                "{t.content}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={t.avatar_url || IMAGES.fallback_avatar} />
                  <AvatarFallback>{t.author[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-bold uppercase tracking-wide">
                    {t.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent.");
    setLoading(false);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider font-bold">
          Name
        </label>
        <Input
          {...register("name")}
          className="border-0 border-b border-primary/20 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
          placeholder="Enter your name"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider font-bold">
          Email
        </label>
        <Input
          {...register("email")}
          className="border-0 border-b border-primary/20 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider font-bold">
          Message
        </label>
        <Textarea
          {...register("message")}
          className="border-0 border-b border-primary/20 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary min-h-[100px] resize-none"
          placeholder="How can we help?"
        />
      </div>
      <Button
        disabled={loading}
        className="w-full rounded-none h-12 text-xs uppercase tracking-widest font-bold"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Send Message"}
      </Button>
    </form>
  );
};

const Footer = ({ biz }: { biz: BizData }) => {
  return (
    <footer
      id="contact"
      className="bg-foreground text-background py-24 px-6 md:px-12"
    >
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-8">
          <h3 className="text-3xl font-serif font-bold">{biz.name}.</h3>
          <div className="space-y-4 text-sm opacity-80 font-light">
            <p>{biz.address}</p>
            <p>{biz.phone}</p>
            <p>{biz.email}</p>
          </div>
          <div className="flex gap-4">
            {biz.social_links.map((l) => (
              <Link
                key={l.id}
                href={l.url}
                className="hover:text-primary transition-colors"
              >
                {l.platform.toLowerCase().includes("instagram") ? (
                  <Instagram className="w-5 h-5" />
                ) : (
                  <Globe className="w-5 h-5" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-sm font-bold uppercase tracking-widest">Hours</h4>
          <div className="space-y-2 text-sm opacity-80 font-light">
            <div className="flex justify-between max-w-[200px] border-b border-white/10 pb-2">
              <span>Mon - Fri</span>
              <span>7am - 8pm</span>
            </div>
            <div className="flex justify-between max-w-[200px] border-b border-white/10 pb-2">
              <span>Sat - Sun</span>
              <span>8am - 9pm</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h4 className="text-sm font-bold uppercase tracking-widest">
            Contact Us
          </h4>
          <ContactForm />
        </div>
      </div>

      <div className="mt-24 pt-8 border-t border-white/10 text-center text-xs opacity-40 uppercase tracking-widest">
        © {new Date().getFullYear()} {biz.name}. All rights reserved.
      </div>
    </footer>
  );
};

// --- Main Layout ---

export function DefaultBiz({ biz, themeMode, onSetThemeMode }: Props) {
  if (!biz) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <Navbar biz={biz} themeMode={themeMode} onSetThemeMode={onSetThemeMode} />

      <main>
        <Hero biz={biz} />
        <ProductGrid products={biz.products} />
        <AboutSection biz={biz} />
        <ReviewsSection testimonials={biz.testimonials} />
      </main>

      <Footer biz={biz} />
    </div>
  );
}
