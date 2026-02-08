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
  Plus,
  Minus,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  X,
  Menu,
  BadgeCheck,
  UtensilsCrossed,
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
      <header className="sticky top-0 z-50 w-full bg-background border-b-4 border-double border-primary/20 shadow-sm">
        <div className="container mx-auto max-w-6xl h-20 flex items-center justify-between px-6">
          {/* Logo - Badge Style */}
          <Link
            href="/"
            className="relative group flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-125 transition-transform duration-300"></div>
            {biz?.logo_url ? (
              <img
                src={biz.logo_url}
                alt={biz.name || "Logo"}
                className="h-12 w-auto object-contain relative z-10"
              />
            ) : (
              <div className="flex flex-col items-center leading-none relative z-10">
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  The
                </span>
                <span className="text-2xl font-serif font-black tracking-tight text-primary uppercase decoration-4 underline-offset-4 decoration-primary/30">
                  {biz?.name || "RETRO"}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Nav - Serif Links */}
          <nav className="hidden md:flex items-center gap-12">
            {["Menu", "About", "Locations"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-serif font-medium text-foreground hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="border-2 border-primary/10 rounded-full p-1">
              <ThemeSwitchToggle
                isDarkMode={themeMode === "dark"}
                onSetThemeMode={onSetThemeMode}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden border-2 border-primary/20 text-primary"
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

      {/* Mobile Drawer - Vintage Paper Feel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background md:hidden flex flex-col items-center justify-center p-8 border-8 border-double border-primary/20 m-4 rounded-xl shadow-2xl animate-in zoom-in-95">
          <div className="space-y-6 text-center">
            <UtensilsCrossed className="w-12 h-12 mx-auto text-primary/40 mb-4" />
            <Link
              href="#menu"
              className="block text-4xl font-serif font-bold text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="#about"
              className="block text-4xl font-serif font-bold text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#locations"
              className="block text-4xl font-serif font-bold text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Visit Us
            </Link>
          </div>
          <Button
            variant="ghost"
            className="mt-12 text-muted-foreground font-serif italic"
            onClick={() => setMobileMenuOpen(false)}
          >
            Close Menu
          </Button>
        </div>
      )}
    </>
  );
};

const BizHero = ({ biz }: { biz?: BizData }) => {
  return (
    <section className="relative w-full py-16 md:py-24 px-4 overflow-hidden bg-secondary/30">
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 relative z-10">
          {/* Decorative Top Badge */}
          <div className="flex items-center gap-4 mb-6 text-primary/60 font-bold tracking-widest text-xs uppercase">
            <span className="h-px w-8 bg-primary/40"></span>
            <Star size={12} fill="currentColor" />
            <span>{biz?.tagline || "Est. Nineteen Eighty-Four"}</span>
            <Star size={12} fill="currentColor" />
            <span className="h-px w-8 bg-primary/40"></span>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-black text-foreground uppercase mb-8 drop-shadow-sm leading-[0.9]">
            {biz?.name || "The Diner"}
          </h1>

          <p className="text-xl md:text-2xl font-serif italic text-muted-foreground max-w-2xl leading-relaxed">
            {biz?.hero_description ||
              "Old fashioned quality for modern times. Good food, good mood."}
          </p>

          <div className="mt-10 flex gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 rounded-full font-bold uppercase tracking-wide border-2 border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary transition-colors shadow-lg"
            >
              <Link href="#menu">Order Now</Link>
            </Button>
          </div>
        </div>

        {/* Hero Image Frame */}
        <div className="relative p-3 bg-background border-2 border-primary/10 shadow-xl rotate-1 max-w-4xl mx-auto">
          <div className="border border-primary/10 p-2">
            <div className="relative aspect-video w-full overflow-hidden grayscale-[20%] sepia-[20%] contrast-110">
              <img
                src={biz?.hero_image_url || "/placeholder-diner.jpg"}
                alt="Hero"
                className="w-full h-full object-cover"
              />
              {/* Vintage Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-4 right-4 bg-background/90 px-4 py-2 rounded-sm border border-primary/20 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Featured Selection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BizMenu = ({ biz }: { biz?: BizData }) => {
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

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
    <section id="menu" className="py-24 bg-background">
      <div className="container mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
            Menu
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground font-medium italic">
            Fresh from the kitchen to your table.
          </p>
        </div>

        {/* Categories Tab - Ticket Style */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b-2 border-primary/10 pb-8">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-6 py-2 font-bold uppercase tracking-wider text-sm transition-all border-2 rounded-lg",
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] translate-x-[-2px] translate-y-[-2px]"
                  : "bg-background text-muted-foreground border-transparent hover:border-primary/20 hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu List - Classic Diner Layout with Images */}
        <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product: any, idx) => (
              <div
                key={idx}
                className="group flex gap-5 items-start transition-all hover:translate-x-1"
              >
                {/* Product Image */}
                {product.image_url && (
                  <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/10 shadow-sm relative bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover grayscale-[50%] contrast-110 group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}

                {/* Text Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-baseline mb-2">
                    <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {product.name}
                    </h3>
                    {/* Dotted Leader */}
                    <div className="flex-grow border-b-2 border-dotted border-primary/30 mx-3 relative -top-1"></div>
                    <span className="text-xl font-bold text-primary">
                      ₱{product.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed italic line-clamp-2">
                    {product.description ||
                      "Served with our signature house sides."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground font-serif italic">
              Sold out for the day.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-2 border-primary/20 rounded-full hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-serif font-bold text-lg">
              Page {currentPage}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-2 border-primary/20 rounded-full hover:bg-primary hover:text-primary-foreground"
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
    <section id="gallery" className="bg-background py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-2 font-serif text-4xl font-bold text-primary md:text-5xl">
            Captured Moments
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-primary/20" />
        </div>

        <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 md:grid-cols-3">
          {biz.biz_gallery.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              className="group rotate-1 border border-primary/10 bg-white p-4 shadow-lg transition-all duration-300 hover:rotate-0 hover:scale-105 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 grayscale-[10%] transition-all group-hover:grayscale-0">
                <img
                  src={item.image_url || item.url}
                  alt="Gallery"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="pt-4 text-center font-serif text-sm italic text-muted-foreground">
                {item.description || `#${idx + 1} — Good Times`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BizInfoGrid = ({ biz }: { biz?: BizData }) => {
  return (
    <section
      id="about"
      className="py-20 bg-primary text-primary-foreground border-y-8 border-double border-primary-foreground/20"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Cluster */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 border-4 border-primary-foreground/30 translate-x-4 translate-y-4 rounded-xl"></div>
            <div className="relative bg-background p-2 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={
                  biz?.about_image_url ||
                  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
                }
                alt="About"
                className="w-full h-auto rounded-lg grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 border border-primary-foreground/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <BadgeCheck size={14} />
              <span>Authentic Quality</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Our Story
            </h2>
            <p className="text-lg md:text-xl font-medium leading-relaxed opacity-90 mb-8 max-w-md mx-auto md:mx-0">
              {biz?.description ||
                "Founded on the principles of hard work and hearty meals. We've been serving the community with a smile since day one."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-primary-foreground/20 pt-8">
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm mb-2 opacity-70">
                  <Clock size={16} /> Hours
                </div>
                <p className="font-serif text-xl">
                  {biz?.operation_hours || "7AM - 9PM Daily"}
                </p>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm mb-2 opacity-70">
                  <Phone size={16} /> Contact
                </div>
                <p className="font-serif text-xl">{biz?.phone || "555-0123"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BizFaq = ({ biz }: { biz?: BizData }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!biz?.biz_faqs?.length) return null;

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-primary">
            Need to Know?
          </h2>
        </div>

        <div className="space-y-4">
          {biz.biz_faqs.map((faq: any, idx: number) => (
            <div
              key={faq.id || idx}
              className="bg-background border-2 border-primary/10 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-primary/5 transition-colors"
              >
                <span className="font-serif font-bold text-lg text-foreground">
                  {faq.question}
                </span>
                <span
                  className={`transform transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`}
                >
                  {openFaq === idx ? (
                    <Minus className="text-primary" />
                  ) : (
                    <Plus className="text-muted-foreground" />
                  )}
                </span>
              </button>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out border-t border-primary/10",
                  openFaq === idx
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="p-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
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
    <footer id="locations" className="bg-foreground text-background pt-20 pb-8">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-16 border-b border-background/20 pb-16">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-6">
            <h2 className="text-4xl font-serif font-bold">
              {biz?.name || "RETRO"}
            </h2>
            <p className="text-background/70 leading-relaxed">
              Making memories and serving meals that remind you of home. Drop by
              and say hello.
            </p>
            <div className="flex gap-3">
              {biz?.social_links?.map((link: any, idx: number) => (
                <Link
                  key={idx}
                  href={link.url}
                  className="bg-background/10 hover:bg-primary hover:text-foreground p-2 rounded-lg transition-all"
                >
                  {getSocialIcon(link.platform)}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Col */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-widest text-primary">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3 text-lg font-serif">
              <Link
                href="#menu"
                className="hover:text-primary transition-colors"
              >
                Menu
              </Link>
              <Link
                href="#about"
                className="hover:text-primary transition-colors"
              >
                Our Story
              </Link>
              <Link
                href="#locations"
                className="hover:text-primary transition-colors"
              >
                Locations
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Careers
              </Link>
            </nav>
          </div>

          {/* Map Col */}
          <div className="h-64 rounded-xl overflow-hidden border-4 border-background/10 relative">
            {isMounted && mapCoordinates ? (
              <MapContainer
                center={mapCoordinates}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full grayscale contrast-125"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <CircleMarker
                  center={mapCoordinates}
                  pathOptions={{
                    color: "white",
                    fillColor: "#000",
                    fillOpacity: 0.8,
                  }}
                  radius={8}
                ></CircleMarker>
              </MapContainer>
            ) : (
              <div className="h-full w-full bg-background/5 flex items-center justify-center text-center p-4">
                <span className="text-background/40 font-serif italic">
                  Map Data Unavailable
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-background/40 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {biz?.name}. Classic & Timeless.
          </p>
          <div className="flex gap-4">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export function BizRetro({ biz, themeMode, onSetThemeMode }: Props) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col font-sans antialiased selection:bg-primary selection:text-primary-foreground",
        "bg-background text-foreground",
      )}
    >
      {/* Leaflet Customization for Retro Theme */}
      <style jsx global>{`
        .leaflet-container {
          z-index: 0;
          background: #f0f0f0;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 4px;
          border: 2px solid black;
          font-family: serif;
        }
        .leaflet-popup-tip {
          background: black;
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
