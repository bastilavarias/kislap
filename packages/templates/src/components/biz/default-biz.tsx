"use client";

import { useState, useMemo, useEffect } from "react";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Mode } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

// --- LEAFLET IMPORTS ---
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

// --- HELPER: EXTRACT COORDS FROM GOOGLE MAPS LINK ---
const getCoordinatesFromLink = (url?: string): [number, number] | null => {
  if (!url) return null;

  // Pattern 1: @lat,lng
  const atPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const atMatch = url.match(atPattern);
  if (atMatch) return [parseFloat(atMatch[1]), parseFloat(atMatch[2])];

  // Pattern 2: q=lat,lng
  const qPattern = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const qMatch = url.match(qPattern);
  if (qMatch) return [parseFloat(qMatch[1]), parseFloat(qMatch[2])];

  // Pattern 3: Embed style (!3d...!4d)
  const embedLat = /!3d(-?\d+\.\d+)/;
  const embedLng = /!4d(-?\d+\.\d+)/;
  const latMatch = url.match(embedLat);
  const lngMatch = url.match(embedLng);
  if (latMatch && lngMatch)
    return [parseFloat(latMatch[1]), parseFloat(lngMatch[2])];

  return null;
};

const Marquee = ({
  text,
  reverse = false,
}: {
  text: string;
  reverse?: boolean;
}) => (
  <div className="overflow-hidden flex items-center bg-background text-foreground h-full w-full">
    <div
      className={cn(
        "whitespace-nowrap flex items-center gap-8",
        reverse ? "animate-marquee-reverse" : "animate-marquee",
      )}
    >
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className="text-xl font-bold uppercase tracking-widest font-mono"
        >
          {text} <span className="text-accent mx-4">///</span>
        </span>
      ))}
    </div>
  </div>
);

export function DefaultBiz({ biz, themeMode, onSetThemeMode }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- MENU LOGIC STATE ---
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- MAP STATE ---
  const [isMounted, setIsMounted] = useState(false);

  const itemsPerPage = 4;

  // --- EFFECTS ---
  useEffect(() => {
    setIsMounted(true); // Ensures Leaflet only attempts to render on client
  }, []);

  // --- DERIVED DATA ---
  const products = biz?.products || [];

  // Extract Coordinates
  const mapCoordinates = useMemo(() => {
    return getCoordinatesFromLink(biz?.map_link);
  }, [biz?.map_link]);

  // 1. Get Unique Categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p: any) => p.category).filter(Boolean));
    return ["ALL", ...Array.from(cats)];
  }, [products]);

  // 2. Filter & Sort Logic
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filter
    if (categoryFilter !== "ALL") {
      result = result.filter((p: any) => p.category === categoryFilter);
    }

    // Sort
    if (sortOrder) {
      result.sort((a: any, b: any) => {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      });
    }

    return result;
  }, [products, categoryFilter, sortOrder]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

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

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
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

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-accent-foreground">
      <style jsx global>{`
        .animate-marquee {
          animation: scroll-left 15s linear infinite;
        }
        .animate-marquee-reverse {
          animation: scroll-right 15s linear infinite;
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .shadow-hard {
          box-shadow: 8px 8px 0px 0px var(--primary);
        }
        .shadow-hard-hover:hover {
          box-shadow: none;
          transform: translate(4px, 4px);
        }
        /* Custom Leaflet overrides for brutalist look */
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
        className={cn(
          "flex-grow flex flex-col border-x-[12px] md:border-x-[16px]",
          "bg-background text-foreground border-primary",
        )}
      >
        <header className="sticky top-0 z-50 border-b-4 border-primary flex justify-between items-stretch h-20 bg-background">
          <div className="bg-primary text-primary-foreground px-6 flex items-center justify-center border-r-4 border-primary w-32 md:w-48 group cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <h1 className="text-3xl md:text-5xl font-display tracking-tighter group-hover:scale-110 transition-transform">
              KAF.
            </h1>
          </div>

          <div className="flex-grow overflow-hidden hidden md:flex items-center bg-background border-r-4 border-primary">
            <Marquee text="CAFFEINE INJECTION /// NO DECAF /// CASHLESS /// LOUD NOISES /// DO NOT LOITER" />
          </div>

          <div className="flex items-center bg-background">
            <div className="px-4 h-full flex items-center justify-center border-l-0 md:border-l-4 border-primary bg-background">
              <ThemeSwitchToggle
                isDarkMode={themeMode === "dark"}
                onSetThemeMode={onSetThemeMode}
              />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden px-6 h-full flex items-center border-l-4 border-primary font-bold bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {mobileMenuOpen ? <X /> : "[+]"}
            </button>

            {/* Desktop Links */}
            <nav className="hidden md:flex font-bold text-lg h-full divide-x-4 divide-primary border-l-4 border-primary">
              <a
                href="#menu"
                className="px-8 h-full flex items-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                MENU_01
              </a>
              <a
                href="#locations"
                className="px-8 h-full flex items-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                LOC_02
              </a>
              <a
                href="#void"
                className="px-8 h-full flex items-center bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors border-t-0"
              >
                ENTER_VOID
              </a>
            </nav>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden border-b-4 border-primary bg-primary text-accent p-4 space-y-2">
            <a
              href="#menu"
              className="block py-2 text-2xl font-bold hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              -&gt; MENU
            </a>
            <a
              href="#locations"
              className="block py-2 text-2xl font-bold hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              -&gt; LOCATIONS
            </a>
            <a
              href="#void"
              className="block py-2 text-2xl font-bold hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              -&gt; ENTER VOID
            </a>
          </div>
        )}

        <main className="flex-grow">
          <section className="grid md:grid-cols-2 min-h-[80vh] border-b-4 border-primary">
            <div className="p-8 md:p-16 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-primary bg-background relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[15rem] md:text-[20rem] font-display leading-none text-muted/10 select-none pointer-events-none -mr-20 -mt-20">
                01
              </div>
              <div className="relative z-10">
                <div className="inline-block border-2 border-primary px-2 py-1 text-xs font-bold mb-6 bg-background shadow-hard-hover text-foreground uppercase">
                  {biz?.tagline}
                </div>
                <h1 className="text-6xl md:text-8xl font-display leading-[0.85] mb-8 uppercase text-foreground">
                  {biz?.name}
                </h1>
                <p className="text-xl font-bold max-w-md border-l-8 border-accent pl-6 py-2 bg-background/80 text-foreground">
                  {biz?.hero_description}
                </p>
              </div>
              <div className="mt-12 relative z-10">
                <a
                  href="#menu"
                  className="inline-block bg-primary text-primary-foreground px-10 py-5 text-xl font-bold uppercase shadow-hard hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all border-2 border-transparent hover:border-primary hover:bg-accent hover:text-accent-foreground"
                >
                  Menu -&gt;
                </a>
              </div>
            </div>
            <div className="relative group overflow-hidden bg-primary">
              <img
                src={biz?.hero_image_url}
                className="w-full h-full object-cover grayscale contrast-150 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700 opacity-80"
                alt="Dark Coffee"
              />
              <div className="absolute bottom-0 left-0 bg-accent px-6 py-4 border-t-4 border-r-4 border-primary">
                <p className="text-accent-foreground font-bold">
                  {biz?.hero_title}
                </p>
              </div>
            </div>
          </section>

          <section
            id="menu"
            className="py-20 px-4 md:px-0 bg-primary text-secondary border-b-4 border-primary relative"
          >
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-display uppercase text-primary-foreground mb-2">
                  Our Menu
                </h2>
                <p className="font-mono text-accent">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>

              <div className="bg-secondary text-secondary-foreground p-6 md:p-12 shadow-[16px_16px_0px_0px_var(--accent)] border-4 border-white max-w-3xl mx-auto relative transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full border-4 border-accent"></div>
                <div className="text-center border-b-4 border-dashed border-primary pb-6 mb-8">
                  <h3 className="text-4xl font-display font-bold">
                    {biz?.name}
                  </h3>
                  <p className="text-sm font-bold mt-2">
                    ORDER AT: {biz?.phone} \\ {biz?.email}
                    <br />
                    LOC: {biz?.address}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b-4 border-primary pb-6">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat: any) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={cn(
                          "px-3 py-1 text-sm font-bold border-2 border-primary uppercase transition-all",
                          categoryFilter === cat
                            ? "bg-primary text-secondary"
                            : "bg-transparent text-primary hover:bg-primary/10",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={toggleSort}
                    className="flex items-center gap-2 px-4 py-1 text-sm font-bold border-2 border-primary uppercase hover:bg-primary hover:text-secondary transition-colors"
                  >
                    Price <ArrowUpDown size={14} />{" "}
                    {sortOrder === "asc"
                      ? "(LOW)"
                      : sortOrder === "desc"
                        ? "(HIGH)"
                        : "(DEF)"}
                  </button>
                </div>

                <div className="space-y-8 font-bold text-lg min-h-[400px]">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product: any, idx) => {
                      const description =
                        product.description?.length > 100
                          ? product.description.substring(0, 100) + "..."
                          : product.description;
                      return (
                        <div
                          key={product.id || idx}
                          className="flex flex-col sm:flex-row gap-4 items-start group cursor-pointer text-primary animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                          {product.image_url && (
                            <div className="shrink-0 relative">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-24 h-24 object-cover border-2 border-primary shadow-[4px_4px_0px_0px_var(--primary)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all"
                              />
                            </div>
                          )}
                          <div className="flex-grow w-full">
                            <div className="flex justify-between items-end">
                              <h4 className="text-xl md:text-2xl uppercase bg-white group-hover:bg-primary group-hover:text-accent inline-block px-1 transition-colors border-2 border-transparent group-hover:border-accent">
                                {product.name}
                              </h4>
                              <div className="hidden sm:block border-b-2 border-dotted border-primary flex-grow mx-4 mb-2 opacity-50"></div>
                              <span className="text-2xl font-display">
                                ${product.price}
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground mt-2 font-mono leading-relaxed border-l-2 border-primary/20 pl-3 ml-1">
                              {description}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 font-mono text-primary/50">
                      // NO_DATA_FOUND_IN_SECTOR
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 pt-6 border-t-4 border-dashed border-primary flex justify-between items-center">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border-2 border-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-secondary transition-colors"
                    >
                      <ChevronLeft />
                    </button>
                    <div className="font-mono font-bold text-sm">
                      PAGE {currentPage} / {totalPages}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border-2 border-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-secondary transition-colors"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                )}

                <div className="border-t-4 border-dashed border-primary pt-6 mt-8 text-center uppercase text-sm font-bold text-primary">
                  <p>Total Caffeine: CRITICAL</p>
                  <p className="mt-2">*** NO REFUNDS ***</p>
                  <div className="mt-6 w-full h-16 bg-primary flex items-center justify-center overflow-hidden">
                    <div
                      className="w-[90%] h-10 bg-white"
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

          {/* INFO / TESTIMONIALS / ABOUT GRID */}
          <section className="grid grid-cols-1 md:grid-cols-3 border-b-4 border-primary min-h-[400px]">
            {/* BOX 1: INFO HUB */}
            <div className="bg-accent text-accent-foreground border-b-4 md:border-b-0 md:border-r-4 border-primary p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-display font-bold uppercase mb-6 flex items-center gap-2">
                  <span className="w-4 h-4 bg-primary inline-block"></span>Intel
                </h3>
                <div className="space-y-6 font-mono font-bold text-sm md:text-base">
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
                    <p className="uppercase">
                      {biz?.address || "Location Unknown"}
                    </p>
                  </div>
                  <div className="group">
                    <p className="flex items-center gap-2 text-primary/60 mb-1 uppercase text-xs">
                      <Phone size={14} /> Comms
                    </p>
                    <p>{biz?.phone || "NO_SIGNAL"}</p>
                    <p>{biz?.email || "void@kaffee.com"}</p>
                  </div>
                </div>
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
                          alt="avatar"
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
                      <button
                        onClick={prevTestimonial}
                        className="w-8 h-8 flex items-center justify-center border-2 border-primary hover:bg-primary hover:text-secondary transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={nextTestimonial}
                        className="w-8 h-8 flex items-center justify-center border-2 border-primary hover:bg-primary hover:text-secondary transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
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
                alt="About Us"
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
                <div className="border-4 border-white p-6 max-w-sm relative">
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
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER / FAQ / MAP */}
          <footer
            id="locations"
            className="grid md:grid-cols-2 bg-background border-primary min-h-[500px]"
          >
            {/* FAQs */}
            <div className="p-8 md:p-16 border-b-4 md:border-b-0 md:border-r-4 border-primary flex flex-col justify-between">
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
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-4 font-bold text-left hover:bg-primary hover:text-secondary transition-colors group"
                      >
                        <span className="uppercase text-sm md:text-base pr-4">
                          {faq.question}
                        </span>
                        <span className="shrink-0">
                          {openFaq === idx ? (
                            <Minus size={18} />
                          ) : (
                            <Plus size={18} />
                          )}
                        </span>
                      </button>
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
                    <a
                      key={link.id || idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_transparent] hover:shadow-[4px_4px_0px_0px_var(--primary)]"
                      title={link.platform}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
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
        </main>
      </div>
    </div>
  );
}
