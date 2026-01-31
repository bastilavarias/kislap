"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Mode } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  ArrowUpDown,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  X,
  Menu,
  Plus,
} from "lucide-react";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// --- Types & Helpers (Same as before) ---

export interface BizData {
  id?: number;
  name?: string;
  [key: string]: any;
}

interface Props {
  biz?: BizData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const getCoordinatesFromLink = (url?: string): [number, number] | null => {
  if (!url) return null;
  const atPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const atMatch = url.match(atPattern);
  if (atMatch) return [parseFloat(atMatch[1]), parseFloat(atMatch[2])];

  const qPattern = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const qMatch = url.match(qPattern);
  if (qMatch) return [parseFloat(qMatch[1]), parseFloat(qMatch[2])];

  const embedLat = /!3d(-?\d+\.\d+)/;
  const embedLng = /!4d(-?\d+\.\d+)/;
  const latMatch = url.match(embedLat);
  const lngMatch = url.match(embedLng);
  if (latMatch && lngMatch)
    return [parseFloat(latMatch[1]), parseFloat(lngMatch[2])];

  return null;
};

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram size={18} />;
    case "facebook":
      return <Facebook size={18} />;
    case "youtube":
      return <Youtube size={18} />;
    default:
      return <Globe size={18} />;
  }
};

// --- Sub-Components ---

const BizHeader = ({
  biz,
  themeMode,
  onSetThemeMode,
}: {
  biz?: BizData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out border-b border-transparent",
          scrolled
            ? "bg-background/80 backdrop-blur-md border-border/10 py-2"
            : "bg-transparent py-4",
        )}
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            {biz?.logo_url ? (
              <img
                src={biz.logo_url}
                alt={biz.name || "Logo"}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-sans font-bold tracking-tight text-foreground">
                {biz?.name?.toLowerCase() || "kaf."}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-muted-foreground">
            <Link href="#menu" className="hover:text-primary transition-colors">
              Menu
            </Link>
            <Link
              href="#story"
              className="hover:text-primary transition-colors"
            >
              Our Story
            </Link>
            <Link
              href="#visit"
              className="hover:text-primary transition-colors"
            >
              Visit
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="scale-90">
              <ThemeSwitchToggle
                isDarkMode={themeMode === "dark"}
                onSetThemeMode={onSetThemeMode}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
          <Link
            href="#menu"
            className="text-3xl font-light tracking-tight hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            href="#story"
            className="text-3xl font-light tracking-tight hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Story
          </Link>
          <Link
            href="#visit"
            className="text-3xl font-light tracking-tight hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Visit
          </Link>
          <Button
            variant="outline"
            className="mt-8 rounded-full px-8"
            onClick={() => setMobileMenuOpen(false)}
          >
            Close
          </Button>
        </div>
      )}
    </>
  );
};

const BizHero = ({ biz }: { biz?: BizData }) => {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden pt-10 pb-20 px-6">
      <div className="container max-w-7xl grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="order-2 md:order-1 flex flex-col items-start gap-8 animate-in slide-in-from-left-4 duration-700 fade-in">
          <div className="space-y-4">
            <span className="text-primary text-sm font-medium tracking-widest uppercase opacity-80">
              {biz?.tagline || "Est. 2024"}
            </span>
            <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.1]">
              {biz?.name || "The Daily Grind"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-lg">
              {biz?.hero_description ||
                "A sanctuary for coffee lovers. Experience calm, community, and the perfect cup in a space designed for you."}
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 h-12 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Link href="#menu">View Menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 text-sm font-medium border-border/50 hover:bg-secondary transition-all duration-300"
            >
              <Link href="#visit">Find Us</Link>
            </Button>
          </div>
        </div>

        {/* Image / Visual */}
        <div className="order-1 md:order-2 relative group">
          <div className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden rounded-[2rem] shadow-2xl">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10 pointer-events-none" />
            <img
              src={biz?.hero_image_url || "/placeholder-cafe.jpg"}
              alt="Cafe Atmosphere"
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
          </div>
          {/* Decorative Circle */}
          <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

const BizMenu = ({ biz }: { biz?: BizData }) => {
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // More items for minimal list view

  const products = biz?.products || [];

  const categories = useMemo(() => {
    const cats = new Set(products.map((p: any) => p.category).filter(Boolean));
    return ["ALL", ...Array.from(cats)];
  }, [products]);

  const processedProducts = useMemo(() => {
    let result = [...products];
    if (categoryFilter !== "ALL") {
      result = result.filter((p: any) => p.category === categoryFilter);
    }
    return result;
  }, [products, categoryFilter]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  return (
    <section id="menu" className="py-24 bg-secondary/30">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold tracking-tight">
            Curated Selection
          </h2>
          <p className="text-muted-foreground font-light max-w-lg mx-auto">
            Handcrafted with patience and precision.
          </p>
        </div>

        {/* Categories - Minimal Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background text-muted-foreground hover:bg-background/80 hover:text-foreground border border-transparent hover:border-border/50",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid - Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product: any, idx) => (
              <div
                key={product.id || idx}
                className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-background transition-colors duration-300"
              >
                {product.image_url && (
                  <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted/50 shadow-sm">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-medium text-foreground/80">
                      ₱{product.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">
                    {product.description ||
                      "Freshly prepared with local ingredients."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted-foreground font-light italic">
              No items found in this category.
            </div>
          )}
        </div>

        {/* Simple Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full border-border/50 hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center text-sm font-medium text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border-border/50 hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const BizGallery = ({ biz }: { biz?: BizData }) => {
  if (!biz?.biz_gallery || biz.biz_gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-secondary/30">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold tracking-tight">
            Gallery
          </h2>
          <p className="text-muted-foreground font-light max-w-lg mx-auto">
            A glimpse into our world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {biz.biz_gallery.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={item.image_url || item.url}
                alt={item.description || "Gallery Image"}
                className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BizInfoGrid = ({ biz }: { biz?: BizData }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    if (!biz?.testimonials) return;
    setActiveTestimonial((prev) => (prev + 1) % biz.testimonials.length);
  };

  const prevTestimonial = () => {
    if (!biz?.testimonials) return;
    setActiveTestimonial((prev) =>
      prev === 0 ? biz.testimonials.length - 1 : prev - 1,
    );
  };

  return (
    <section id="story" className="py-24 container mx-auto max-w-7xl px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* About Section - Text First */}
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight">
            More than just coffee.
          </h2>
          <div className="prose prose-lg text-muted-foreground font-light leading-relaxed">
            <p>
              {biz?.description ||
                "We believe in the power of a good conversation and a great cup of coffee. Our beans are ethically sourced, our pastries are baked fresh every morning, and our space is designed to be your home away from home."}
            </p>
          </div>

          {/* Minimal Stats / Details */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-border/40">
            <div>
              <h4 className="text-foreground font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Hours
              </h4>
              <p className="text-sm text-muted-foreground">
                {biz?.operation_hours || "Mon-Sun: 7am - 7pm"}
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Location
              </h4>
              <p className="text-sm text-muted-foreground">
                {biz?.address || "City Center"}
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          {/* Background decorative blob */}
          <div className="absolute inset-0 bg-primary/5 rounded-[3rem] rotate-3 scale-105 -z-10" />

          <div className="bg-card border border-border/40 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-8 left-8 text-6xl text-primary/10 font-serif leading-none">
              “
            </div>

            {biz?.testimonials && biz.testimonials.length > 0 ? (
              <div className="relative z-10 flex flex-col h-full min-h-[300px] justify-between">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < biz.testimonials[activeTestimonial].rating
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        i < biz.testimonials[activeTestimonial].rating
                          ? "text-yellow-400"
                          : "text-muted"
                      }
                    />
                  ))}
                </div>

                <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground/90 mb-8">
                  {biz.testimonials[activeTestimonial].content}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                      <img
                        src={biz.testimonials[activeTestimonial].avatar_url}
                        alt={biz.testimonials[activeTestimonial].author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {biz.testimonials[activeTestimonial].author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Verified Customer
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevTestimonial}
                      className="rounded-full hover:bg-secondary"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextTestimonial}
                      className="rounded-full hover:bg-secondary"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No reviews yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const BizFaq = ({ biz }: { biz?: BizData }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  if (!biz?.biz_faqs?.length) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold tracking-tight mb-4">
            Common Questions
          </h2>
          <p className="text-muted-foreground font-light">
            Everything you need to know about our service.
          </p>
        </div>

        <div className="space-y-4">
          {biz.biz_faqs.map((faq: any, idx: number) => (
            <div
              key={faq.id || idx}
              className="border-b border-border/40 last:border-0"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
              >
                <span
                  className={`text-lg font-medium transition-colors ₱{openFaq === idx ? "text-primary" : "text-foreground group-hover:text-primary/80"}`}
                >
                  {faq.question}
                </span>
                <span
                  className={`transform transition-transform duration-300 ₱{openFaq === idx ? "rotate-45" : "rotate-0"}`}
                >
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </span>
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openFaq === idx
                    ? "max-h-96 opacity-100 pb-6"
                    : "max-h-0 opacity-0",
                )}
              >
                <p className="text-muted-foreground font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BizFooter = ({ biz }: { biz?: BizData }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const mapCoordinates = useMemo(() => {
    return getCoordinatesFromLink(biz?.map_link);
  }, [biz?.map_link]);

  return (
    <footer
      id="visit"
      className="bg-foreground text-background pt-20 pb-10 rounded-t-[3rem] mt-10"
    >
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          {/* Left Column: Contact & Info */}
          <div className="space-y-10">
            <div>
              <h3 className="text-3xl font-bold tracking-tight mb-2">
                {biz?.name || "KAF."}
              </h3>
              <p className="text-background/60 max-w-sm">
                Bringing people together one cup at a time.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-background/50 uppercase tracking-wider">
                    Address
                  </p>
                  <p className="font-medium">
                    {biz?.address || "123 Coffee Lane"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-background/50 uppercase tracking-wider">
                    Contact
                  </p>
                  <p className="font-medium">
                    {biz?.phone || "+1 234 567 890"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-background/50 uppercase tracking-wider">
                    Open
                  </p>
                  <p className="font-medium">{biz?.operation_hours}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {biz?.social_links?.map((link: any, idx: number) => (
                <Link
                  key={idx}
                  href={link.url}
                  className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all duration-300"
                >
                  {getSocialIcon(link.platform)}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="h-[400px] w-full rounded-3xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
            {isMounted && mapCoordinates ? (
              <MapContainer
                center={mapCoordinates}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <CircleMarker
                  center={mapCoordinates}
                  pathOptions={{
                    color: "black",
                    fillColor: "black",
                    fillOpacity: 0.8,
                  }}
                  radius={8}
                >
                  <Popup className="font-sans text-xs">
                    <span className="font-bold">{biz?.name}</span>
                  </Popup>
                </CircleMarker>
              </MapContainer>
            ) : (
              <div className="h-full w-full bg-background/5 flex items-center justify-center">
                <span className="text-background/30">Map Unavailable</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
          <p>
            © {new Date().getFullYear()} {biz?.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-background transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export function BizDefault({ biz, themeMode, onSetThemeMode }: Props) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col font-sans antialiased selection:bg-primary/20",
        "bg-background text-foreground",
      )}
    >
      {/* Leaflet Override for Minimal Theme (removes brutalist borders) */}
      <style jsx global>{`
        .leaflet-container {
          z-index: 0;
          background: #f5f5f5;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 0;
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>

      <BizHeader
        biz={biz}
        themeMode={themeMode}
        onSetThemeMode={onSetThemeMode}
      />

      <main className="flex-grow">
        <BizHero biz={biz} />
        <BizMenu biz={biz} />
        <BizGallery biz={biz} />
        <BizInfoGrid biz={biz} />
        <BizFaq biz={biz} />
      </main>

      <BizFooter biz={biz} />
    </div>
  );
}
