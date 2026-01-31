"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Mode } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Assumed Shadcn Import
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  ArrowUpDown,
  Plus,
  Minus,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  X,
  Menu,
} from "lucide-react";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// --- Types & Helpers ---

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
      return <Instagram size={20} />;
    case "facebook":
      return <Facebook size={20} />;
    case "youtube":
      return <Youtube size={20} />;
    default:
      return <Globe size={20} />;
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label="Back to Home"
            >
              {biz?.logo_url ? (
                <img
                  src={biz.logo_url}
                  alt={biz.name || "Logo"}
                  className="h-8 w-auto object-contain md:h-10 scale-150"
                />
              ) : (
                <span className="text-xl font-bold tracking-tight uppercase">
                  {biz?.name || "KAF"}
                </span>
              )}
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              href="#menu"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Menu
            </Link>
            <Link
              href="#locations"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              About Us
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeSwitchToggle
              isDarkMode={themeMode === "dark"}
              onSetThemeMode={onSetThemeMode}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle Mobile Menu"
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

      {mobileMenuOpen && (
        <nav
          className="md:hidden border-b-4 border-primary bg-primary text-accent p-4 space-y-2 animate-in slide-in-from-top-2"
          aria-label="Mobile Navigation"
        >
          <Link
            href="#menu"
            className="block py-2 text-2xl font-bold hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            -&gt; Menu
          </Link>
          <Link
            href="#locations"
            className="block py-2 text-2xl font-bold hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            -&gt; About Us
          </Link>
        </nav>
      )}
    </>
  );
};

const BizHero = ({ biz }: { biz?: BizData }) => {
  return (
    <section className="grid md:grid-cols-2 w-full border-b border-border/40 bg-background md:h-[600px]">
      <div className="relative flex flex-col justify-center p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-border/40 overflow-hidden">
        <div className="relative z-10 flex flex-col items-start gap-6">
          <div className="inline-flex items-center px-3 py-1 text-xs font-bold tracking-widest uppercase text-primary">
            {biz?.tagline || "EST. 2024"}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.1] text-foreground">
            {biz?.name || "COOKIE DOKEY"}
          </h1>

          <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
            {biz?.hero_description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices nisl nec leo tempus, eu mollis eros eleifend."}
          </p>

          <Button
            asChild
            className="mt-2 bg-primary text-primary-foreground font-bold uppercase tracking-wide px-8 py-6 rounded-none hover:translate-x-1 transition-all"
          >
            <Link href="#menu">Menu -&gt;</Link>
          </Button>
        </div>
      </div>

      <div className="relative h-[400px] md:h-full w-full overflow-hidden bg-muted">
        <img
          src={biz?.hero_image_url || "/placeholder-bakery.jpg"}
          alt={biz?.hero_title || "Bakery Interior"}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />

        <div className="absolute bottom-0 left-0 bg-background/90 backdrop-blur px-6 py-3 border-t border-r border-border/40">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            {biz?.hero_title || "Fresh Daily"}
          </p>
        </div>
      </div>
    </section>
  );
};

const BizMenu = ({ biz }: { biz?: BizData }) => {
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  // Increased items per page to 6 to fit the 2-column grid better
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    if (sortOrder) {
      result.sort((a: any, b: any) => {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      });
    }
    return result;
  }, [products, categoryFilter, sortOrder]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <section
      id="menu"
      className="py-20 px-4 md:px-8 bg-primary text-secondary border-b-4 border-primary relative"
      aria-label="Product Menu"
    >
      {/* 1. Changed max-width to 7xl to use full width */}
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-display uppercase text-primary-foreground mb-2">
            Our Menu
          </h2>
          <p className="font-mono text-accent">Lorem ipsum dolor sit amet.</p>
        </header>

        {/* 2. Removed max-w-3xl to allow full width expansion */}
        <div className="bg-secondary text-secondary-foreground p-6 md:p-12 shadow-[16px_16px_0px_0px_var(--accent)] border-4 border-white w-full mx-auto relative transform rotate-1 hover:rotate-0 transition-transform duration-300">
          {/* Decorative Pin */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full border-4 border-accent"></div>

          {/* Header Info */}
          <div className="text-center border-b-4 border-dashed border-primary pb-6 mb-8">
            <h3 className="text-5xl font-display font-bold uppercase tracking-tighter">
              {biz?.name}
            </h3>
            <address className="text-sm font-bold mt-4 not-italic flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 opacity-80">
              <span>LOC: {biz?.address}</span>
              <span className="hidden md:inline">\\</span>
              <a
                href={`tel:${biz?.phone}`}
                className="hover:bg-primary hover:text-white px-1 transition-colors"
              >
                TEL: {biz?.phone}
              </a>
            </address>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b-4 border-primary pb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: any) => (
                <Button
                  key={cat}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "font-bold uppercase border-2 rounded-none transition-all",
                    categoryFilter === cat
                      ? "bg-primary text-secondary border-primary"
                      : "bg-transparent text-primary border-primary hover:bg-primary/10",
                  )}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <Button
              onClick={toggleSort}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 font-bold border-2 border-primary rounded-none uppercase hover:bg-primary hover:text-secondary transition-colors"
            >
              Price <ArrowUpDown size={14} />{" "}
              {sortOrder === "asc"
                ? "(LOW)"
                : sortOrder === "desc"
                  ? "(HIGH)"
                  : "(DEF)"}
            </Button>
          </div>

          {/* 3. Grid Layout Implementation */}
          <div className="min-h-[400px]">
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                {paginatedProducts.map((product: any, idx) => {
                  const description =
                    product.description?.length > 100
                      ? product.description.substring(0, 100) + "..."
                      : product.description;
                  return (
                    <article
                      key={product.id || idx}
                      className="flex flex-col sm:flex-row gap-6 items-start group cursor-pointer text-primary animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      {product.image_url && (
                        <div className="shrink-0 relative">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-28 h-28 object-cover border-2 border-primary shadow-[4px_4px_0px_0px_var(--primary)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all bg-white"
                          />
                        </div>
                      )}
                      <div className="flex-grow w-full">
                        <div className="flex justify-between items-end border-b-2 border-dotted border-primary/40 pb-1 mb-2">
                          <h4 className="text-xl md:text-2xl font-bold uppercase bg-white group-hover:bg-primary group-hover:text-accent inline-block px-1 -ml-1 transition-colors">
                            {product.name}
                          </h4>
                          <span className="text-2xl font-display font-bold">
                            ₱{product.price}
                          </span>
                        </div>
                        <p className="text-sm text-primary/70 font-mono leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 font-mono text-primary/50 text-xl border-2 border-dashed border-primary/20">
                // NO_DATA_FOUND_IN_SECTOR
              </div>
            )}
          </div>

          {/* Footer / Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t-4 border-dashed border-primary flex justify-between items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 border-2 border-primary rounded-none font-bold disabled:opacity-50 hover:bg-primary hover:text-secondary"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="font-mono font-bold text-lg tracking-widest">
                PAGE {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-12 h-12 border-2 border-primary rounded-none font-bold disabled:opacity-50 hover:bg-primary hover:text-secondary"
                aria-label="Next Page"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}

          <div className="border-t-4 border-dashed border-primary pt-6 mt-12 text-center uppercase text-sm font-bold text-primary opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex justify-center items-center gap-4 mb-4 text-xs font-mono">
              <span>ID: {biz?.id || "UNK"}</span>
              <span>//</span>
              <span>REV: {new Date().getFullYear()}.1</span>
            </div>
            <div className="w-full h-12 bg-primary flex items-center justify-center overflow-hidden">
              <div
                className="w-[95%] h-8 bg-white"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 8px)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BizGallery = ({ biz }: { biz?: BizData }) => {
  if (!biz?.biz_gallery || biz.biz_gallery.length === 0) return null;

  return (
    <section id="gallery" className="bg-background">
      <div className="bg-primary p-1">
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
          {biz.biz_gallery.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              className="group relative aspect-square overflow-hidden bg-black"
            >
              <img
                src={item.image_url || item.url}
                alt="Log Entry"
                className="h-full w-full object-cover opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              />
              {/* Glitch Overlay Effect */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20" />

              <div className="absolute bottom-0 left-0 translate-y-full bg-primary px-2 py-1 font-mono text-xs text-black transition-transform duration-300 group-hover:translate-y-0">
                IMG_{idx.toString().padStart(4, "0")}
              </div>
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
    <section className="grid grid-cols-1 md:grid-cols-3 border-b-4 border-primary min-h-[400px]">
      {/* BOX 1: INFO HUB */}
      <div className="bg-accent text-accent-foreground border-b-4 md:border-b-0 md:border-r-4 border-primary p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-3xl font-display font-bold uppercase mb-6 flex items-center gap-2">
            <span className="w-4 h-4 bg-primary inline-block"></span>Intel
          </h3>
          <address className="space-y-6 font-mono font-bold text-sm md:text-base not-italic">
            <div className="group">
              <p className="flex items-center gap-2 text-primary/60 mb-1 uppercase text-xs">
                <Clock size={14} /> Schedule
              </p>
              <p className="uppercase">
                {biz?.operation_hours || "0600 - 2200"}
              </p>
            </div>
            <div className="group">
              <p className="flex items-center gap-2 text-primary/60 mb-1 uppercase text-xs">
                <MapPin size={14} /> Coordinates
              </p>
              <p className="uppercase">{biz?.address || "Location Unknown"}</p>
            </div>
            <div className="group">
              <p className="flex items-center gap-2 text-primary/60 mb-1 uppercase text-xs">
                <Phone size={14} /> Comms
              </p>
              <p>
                <a href={`tel:${biz?.phone}`}>{biz?.phone || "NO_SIGNAL"}</a>
              </p>
              <p>
                <a href={`mailto:${biz?.email}`}>
                  {biz?.email || "void@kaffee.com"}
                </a>
              </p>
            </div>
          </address>
        </div>
        <div className="mt-8 pt-6 border-t-2 border-primary/20">
          <div className="inline-block px-3 py-1 border-2 border-primary bg-primary text-secondary text-xs font-bold uppercase">
            Status: ONLINE
          </div>
        </div>
      </div>

      {/* BOX 2: TESTIMONIALS CAROUSEL */}
      <div className="bg-background border-b-4 md:border-b-0 md:border-r-4 border-primary p-8 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 text-9xl font-display text-muted/10 pointer-events-none select-none">
          “
        </div>
        {biz?.testimonials && biz.testimonials.length > 0 ? (
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex gap-1 mb-4 text-primary">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={
                    i < biz.testimonials[activeTestimonial].rating
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    i < biz.testimonials[activeTestimonial].rating
                      ? "text-primary"
                      : "text-muted"
                  }
                />
              ))}
            </div>
            <div className="flex-grow">
              <p className="text-lg md:text-xl font-bold leading-tight">
                &quot;{biz.testimonials[activeTestimonial].content}&quot;
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t-4 border-dotted border-primary pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-primary overflow-hidden bg-muted">
                  <img
                    src={biz.testimonials[activeTestimonial].avatar_url}
                    alt={`${biz.testimonials[activeTestimonial].author}'s avatar`}
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm uppercase">
                    {biz.testimonials[activeTestimonial].author}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    VERIFIED_CLIENT
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="w-8 h-8 border-2 border-primary rounded-none hover:bg-primary hover:text-secondary"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="w-8 h-8 border-2 border-primary rounded-none hover:bg-primary hover:text-secondary"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full font-mono text-muted-foreground">
            // NO_DATA_AVAILABLE
          </div>
        )}
      </div>

      {/* BOX 3: ABOUT / HOVER REVEAL */}
      <div className="relative bg-primary h-[400px] md:h-auto overflow-hidden group cursor-crosshair">
        <img
          src={
            biz?.about_image_url ||
            "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
          }
          className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
          alt="About Us Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
        <div className="absolute bottom-6 left-6 z-10 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-4xl font-display text-white uppercase drop-shadow-[4px_4px_0px_#000]">
            The Mission
          </h3>
          <p className="text-white/80 font-mono text-xs mt-1">
            [HOVER_TO_DECRYPT]
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out bg-primary/90">
          <article className="border-4 border-white p-6 max-w-sm relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-white"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white"></div>
            <h4 className="text-2xl font-bold text-white mb-4 uppercase font-display border-b-2 border-white/20 pb-2">
              Classified
            </h4>
            <p className="text-white font-mono text-sm leading-relaxed">
              {biz?.description
                ? biz.description.length > 150
                  ? biz.description.substring(0, 150) + "..."
                  : biz.description
                : "Our mission is simple: provide the highest quality caffeine delivery systems to functionality-obsessed individuals."}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

const BizFooter = ({ biz }: { biz?: BizData }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const mapCoordinates = useMemo(() => {
    return getCoordinatesFromLink(biz?.map_link);
  }, [biz?.map_link]);

  return (
    <footer
      id="locations"
      className="grid md:grid-cols-2 bg-background border-primary min-h-[500px]"
    >
      {/* FAQs */}
      <div className="p-8 md:p-16 border-b-4 md:border-b-0 md:border-x-4 border-primary flex flex-col justify-between">
        <div>
          <h2 className="text-4xl font-display uppercase mb-8 text-foreground">
            Protocol / FAQs
          </h2>
          <div className="space-y-4">
            {biz?.biz_faqs?.map((faq: any, idx: number) => (
              <div
                key={faq.id || idx}
                className="border-2 border-primary bg-background transition-all"
              >
                <Button
                  variant="ghost"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 font-bold text-left hover:bg-primary hover:text-secondary transition-colors h-auto rounded-none"
                  aria-expanded={openFaq === idx}
                >
                  <span className="uppercase text-sm md:text-base pr-4">
                    {faq.question}
                  </span>
                  <span className="shrink-0">
                    {openFaq === idx ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </Button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out border-t-0 border-primary",
                    openFaq === idx
                      ? "max-h-96 opacity-100 border-t-2"
                      : "max-h-0 opacity-0",
                  )}
                >
                  <div className="p-4 text-sm font-mono text-muted-foreground leading-relaxed bg-muted/20">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t-4 border-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-foreground">
          <div className="text-xs font-bold uppercase">
            © {new Date().getFullYear()} {biz?.name?.toUpperCase()}
            <br />
            ALL RIGHTS RESERVED
          </div>
          <div className="flex gap-2 flex-wrap">
            {biz?.social_links?.map((link: any, idx: number) => (
              <Link
                key={link.id || idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_transparent] hover:shadow-[4px_4px_0px_0px_var(--primary)]"
                title={link.platform}
              >
                {getSocialIcon(link.platform)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MAP / FALLBACK */}
      <div className="relative bg-muted overflow-hidden h-96 md:h-auto group min-h-[400px]">
        {isMounted && mapCoordinates ? (
          <div className="h-full w-full relative">
            <MapContainer
              center={mapCoordinates}
              zoom={15}
              scrollWheelZoom={false}
              className="h-full w-full"
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="grayscale contrast-125"
              />
              <CircleMarker
                center={mapCoordinates}
                pathOptions={{
                  color: "var(--primary)",
                  fillColor: "var(--primary)",
                  fillOpacity: 1,
                }}
                radius={10}
              >
                <Popup className="font-mono text-xs font-bold uppercase">
                  {biz?.name}
                  <br />
                  {biz?.address}
                </Popup>
              </CircleMarker>
            </MapContainer>
            {/* Brutalist Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[16px] border-primary/10 z-[1000]"></div>
            <div className="absolute top-4 left-4 bg-primary text-secondary px-3 py-1 font-mono text-xs font-bold pointer-events-none z-[1000]">
              SECTOR_LOCATED
            </div>
          </div>
        ) : (
          /* Fallback: Info Hub (Reused) */
          <div className="h-full bg-accent text-accent-foreground p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
            <h3 className="text-4xl font-display font-bold uppercase mb-8 relative z-10">
              Intel / Comms
            </h3>
            <div className="space-y-6 font-mono font-bold text-lg relative z-10">
              <div className="group">
                <p className="flex items-center justify-center gap-2 text-primary/60 mb-1 uppercase text-xs">
                  <Clock size={14} /> Schedule
                </p>
                <p className="uppercase">
                  {biz?.operation_hours || "0600 - 2200"}
                </p>
              </div>
              <div className="group">
                <p className="flex items-center justify-center gap-2 text-primary/60 mb-1 uppercase text-xs">
                  <MapPin size={14} /> Coordinates
                </p>
                <p className="uppercase">
                  {biz?.address || "Location Unknown"}
                </p>
              </div>
              <div className="group">
                <p className="flex items-center justify-center gap-2 text-primary/60 mb-1 uppercase text-xs">
                  <Phone size={14} /> Contact
                </p>
                <p>{biz?.phone}</p>
                <p>{biz?.email}</p>
              </div>
            </div>
            <div className="mt-10 p-4 border-2 border-dashed border-primary/50 text-xs font-mono uppercase relative z-10">
              *** MAP DATA CORRUPTED ***
              <br />
              PROCEED TO COORDINATES MANUALLY
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export function BizCyber({ biz, themeMode, onSetThemeMode }: Props) {
  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-accent-foreground">
      <style jsx global>{`
        .leaflet-container {
          z-index: 0;
          background: #e5e5e5;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 0;
          border: 2px solid var(--primary);
          box-shadow: 4px 4px 0px 0px var(--primary);
        }
        .leaflet-popup-tip {
          background: var(--primary);
        }
      `}</style>

      <div
        className={cn("grow flex flex-col", "text-foreground border-primary ")}
      >
        <BizHeader
          biz={biz}
          themeMode={themeMode}
          onSetThemeMode={onSetThemeMode}
        />

        <main className="container mx-auto">
          <BizHero biz={biz} />
          <BizMenu biz={biz} />
          <BizGallery biz={biz} />
          <BizInfoGrid biz={biz} />
          <BizFooter biz={biz} />
        </main>
      </div>
    </div>
  );
}
