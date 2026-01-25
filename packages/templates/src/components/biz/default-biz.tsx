"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Star,
  Plus,
  Minus,
  Quote,
} from "lucide-react";
import { Mode } from "@/contexts/settings-context";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitchToggle } from "../theme-switch-toggle";

// --- Types ---
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
  category: string | null;
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

interface BizFAQ {
  id: number;
  question: string;
  answer: string;
}

interface BizGalleryImage {
  id: number;
  image_url: string | null;
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
  logo_url: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_image_url: string | null;
  about_image_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  map_link: string | null;
  schedule: string | null;
  operation_hours: string | null;
  services_enabled: boolean;
  products_enabled: boolean;
  booking_enabled: boolean;
  ordering_enabled: boolean;
  services: BizService[];
  products: BizProduct[];
  testimonials: BizTestimonial[];
  social_links: SocialLink[];
  biz_faqs: BizFAQ[];
  biz_gallery: BizGalleryImage[];
}

interface Props {
  biz: BizData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

// --- Components ---

const Hero = ({ biz }: { biz: BizData }) => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {biz.hero_image_url ? (
          <img
            src={biz.hero_image_url}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Logo Centered */}
        <div className="flex justify-center mb-8">
          {biz.logo_url ? (
            <img
              src={biz.logo_url}
              alt="Logo"
              className="h-24 md:h-32 object-contain drop-shadow-xl"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-[#8c7355] flex items-center justify-center text-4xl font-serif font-bold shadow-xl border-4 border-white/20">
              {biz.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm md:text-base tracking-[0.4em] uppercase font-medium text-white/90">
            {biz.tagline || "Established 2020"}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-none tracking-tight">
            {biz.hero_title || biz.name}
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 max-w-xl mx-auto leading-relaxed">
            {biz.hero_description}
          </p>
        </div>

        <div className="pt-8">
          <Button className="bg-[#8c7355] hover:bg-[#7a6246] text-white rounded-none h-14 px-10 text-xs font-bold uppercase tracking-[0.2em] shadow-lg border border-white/20">
            {biz.ordering_enabled ? "Order Online" : "View Details"}
          </Button>
        </div>
      </div>
    </section>
  );
};

const InfoStrip = ({ biz }: { biz: BizData }) => {
  return (
    <div className="bg-[#1a1a1a] text-white py-12 px-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
        <div className="flex flex-col items-center gap-3 px-4">
          <Clock className="w-6 h-6 text-[#8c7355]" />
          <h3 className="uppercase tracking-widest text-xs font-bold text-[#8c7355]">
            Opening Hours
          </h3>
          <p className="text-sm opacity-80">
            {biz.schedule} <br /> {biz.operation_hours}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 px-4 pt-8 md:pt-0">
          <MapPin className="w-6 h-6 text-[#8c7355]" />
          <h3 className="uppercase tracking-widest text-xs font-bold text-[#8c7355]">
            Location
          </h3>
          <p className="text-sm opacity-80">{biz.address}</p>
        </div>
        <div className="flex flex-col items-center gap-3 px-4 pt-8 md:pt-0">
          <Phone className="w-6 h-6 text-[#8c7355]" />
          <h3 className="uppercase tracking-widest text-xs font-bold text-[#8c7355]">
            Contact
          </h3>
          <p className="text-sm opacity-80">
            {biz.phone} <br /> {biz.email}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProductsGrid = ({ products }: { products: BizProduct[] }) => {
  if (!products?.length) return null;

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-screen-xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-[#8c7355]">
            Our Menu
          </h2>
          <p className="text-muted-foreground italic max-w-lg mx-auto">
            Freshly prepared daily using traditional recipes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-square overflow-hidden bg-muted mb-6">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-black text-white px-3 py-1 text-xs uppercase tracking-widest">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-serif text-xl font-medium">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 px-4">
                  {product.description}
                </p>
                <p className="text-[#8c7355] font-bold text-lg pt-2">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = ({ biz }: { biz: BizData }) => {
  return (
    <section className="py-24 px-6 bg-[#f9f7f2] dark:bg-muted/10">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <span className="text-[#8c7355] font-bold uppercase tracking-widest text-xs">
              Our Heritage
            </span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Crafting Tradition Since 2020.
            </h2>
          </div>
          <div className="prose prose-lg text-muted-foreground">
            <p>
              {biz.description ||
                "We are dedicated to the art of creation. Every product that leaves our kitchen is a testament to our commitment to quality."}
            </p>
          </div>
          <div className="pt-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png"
              alt="Signature"
              className="h-12 opacity-50"
            />
          </div>
        </div>
        <div className="order-1 lg:order-2 h-[500px] w-full relative">
          <div className="absolute inset-0 p-4 border border-[#8c7355]/30">
            <div className="w-full h-full relative overflow-hidden bg-white">
              {biz.about_image_url ? (
                <img
                  src={biz.about_image_url}
                  alt="About"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  About Image
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesList = ({ services }: { services: BizService[] }) => {
  if (!services?.length) return null;

  return (
    <section className="py-24 px-6 bg-background border-t border-border">
      <div className="max-w-screen-lg mx-auto text-center space-y-12">
        <h2 className="text-3xl md:text-4xl font-serif text-[#8c7355]">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="border border-border p-8 hover:border-[#8c7355] transition-colors bg-card"
            >
              <h3 className="text-xl font-serif font-bold mb-3">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="flex justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#8c7355]">
                <span>${service.price}</span>
                <span>•</span>
                <span>{service.duration_minutes} Mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GalleryGrid = ({ images }: { images: BizGalleryImage[] }) => {
  if (!images?.length) return null;

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-screen-2xl mx-auto space-y-12">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Portfolio
          </span>
          <h2 className="text-4xl font-serif text-[#8c7355] mt-2">
            A Glimpse Inside
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                "relative aspect-square overflow-hidden bg-muted group",
                i === 0 && "col-span-2 row-span-2",
              )}
            >
              <img
                src={img.image_url || ""}
                alt="Gallery"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQAndTestimonials = ({ biz }: { biz: BizData }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!biz.biz_faqs?.length && !biz.testimonials?.length) return null;

  return (
    <section className="py-24 px-6 bg-[#f9f7f2] dark:bg-muted/10">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Reviews */}
        {biz.testimonials?.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-[#8c7355]">
              Customer Reviews
            </h3>
            <div className="space-y-6">
              {biz.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-background p-8 border border-border shadow-sm"
                >
                  <div className="flex text-[#8c7355] mb-4 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i < t.rating ? "fill-current" : "opacity-30",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-6">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
                      {t.avatar_url && (
                        <img
                          src={t.avatar_url}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.author}</p>
                      <p className="text-xs text-muted-foreground uppercase">
                        Verified
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {biz.biz_faqs?.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-[#8c7355]">
              Common Questions
            </h3>
            <div className="space-y-2">
              {biz.biz_faqs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className="bg-background border border-border"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-serif font-medium pr-4">
                      {faq.question}
                    </span>
                    {openFaq === idx ? (
                      <Minus className="w-4 h-4 text-[#8c7355]" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-dashed">
                          <div
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const ContactAndMap = ({ biz }: { biz: BizData }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent");
    reset();
  };

  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div>
              <span className="text-[#8c7355] font-bold uppercase tracking-widest text-xs">
                Get in Touch
              </span>
              <h2 className="text-4xl font-serif mt-2">Contact Us</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider">
                  Name
                </label>
                <Input
                  {...register("name")}
                  className="rounded-none border-0 border-b border-input bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-[#8c7355]"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider">
                  Email
                </label>
                <Input
                  {...register("email")}
                  className="rounded-none border-0 border-b border-input bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-[#8c7355]"
                  placeholder="Your email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider">
                  Message
                </label>
                <Textarea
                  {...register("message")}
                  className="min-h-[100px] resize-none rounded-none border-0 border-b border-input bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-[#8c7355]"
                  placeholder="How can we help?"
                />
              </div>
              <Button className="w-full bg-[#8c7355] hover:bg-[#7a6246] text-white rounded-none h-12 uppercase text-xs font-bold tracking-widest">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Embed */}
        <div className="h-[500px] lg:h-auto bg-muted relative">
          {biz.address ? (
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(biz.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="grayscale hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Map Unavailable
            </div>
          )}
          {biz.map_link && (
            <a
              href={biz.map_link}
              target="_blank"
              className="absolute bottom-6 right-6 bg-white text-black px-6 py-3 shadow-xl text-xs font-bold uppercase tracking-widest hover:bg-[#8c7355] hover:text-white transition-colors"
            >
              Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

const MinimalFooter = ({ biz }: { biz: BizData }) => (
  <footer className="bg-[#1a1a1a] text-white py-6 px-6 text-center text-xs tracking-widest uppercase">
    <div className="flex flex-col md:flex-row justify-between items-center max-w-screen-xl mx-auto gap-4">
      <p>
        © {new Date().getFullYear()} {biz.name}.
      </p>
      <div className="flex gap-6 opacity-60">
        {biz.social_links?.map((l) => (
          <a
            key={l.id}
            href={l.url}
            className="hover:text-white hover:opacity-100 transition-all"
          >
            {l.platform}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

// --- MAIN LAYOUT ---

export function DefaultBiz({ biz, themeMode, onSetThemeMode }: Props) {
  if (!biz) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[#8c7355] selection:text-white">
      {/* Floating Theme Toggle (Since no navbar) */}
      <div className="fixed top-6 right-6 z-50 mix-blend-difference text-white">
        <ThemeSwitchToggle
          isDarkMode={themeMode === "dark"}
          onSetThemeMode={onSetThemeMode}
        />
      </div>

      <main>
        <Hero biz={biz} />
        <InfoStrip biz={biz} />

        {biz.products_enabled && <ProductsGrid products={biz.products} />}

        <AboutSection biz={biz} />

        {biz.services_enabled && <ServicesList services={biz.services} />}

        <GalleryGrid images={biz.biz_gallery} />

        <FAQAndTestimonials biz={biz} />

        <ContactAndMap biz={biz} />
      </main>

      <MinimalFooter biz={biz} />
    </div>
  );
}
