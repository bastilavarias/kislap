"use client";

import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ShoppingBag,
  Star,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  Loader2,
  ChefHat,
  ArrowRight,
  Quote,
} from "lucide-react";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Mode } from "@/contexts/settings-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

// --- Types & Interfaces ---

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

// --- Helper Components ---

const SocialIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes("facebook")) return <Facebook className="w-4 h-4" />;
  if (p.includes("instagram")) return <Instagram className="w-4 h-4" />;
  if (p.includes("twitter")) return <Twitter className="w-4 h-4" />;
  if (p.includes("linkedin")) return <Linkedin className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
};

// --- Section Components ---

const HeroSection = ({
  biz,
  themeMode,
  onSetThemeMode,
}: {
  biz: BizData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}) => {
  const isDarkMode = useMemo(() => themeMode === "dark", [themeMode]);

  return (
    <header className="relative py-16 md:py-24 text-center space-y-8">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="flex justify-center items-center gap-4 absolute top-4 right-4">
        <ThemeSwitchToggle
          isDarkMode={isDarkMode}
          onSetThemeMode={onSetThemeMode}
        />
      </div>

      <div className="space-y-6 max-w-4xl mx-auto px-4">
        {/* Badge / Tagline */}
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="px-4 py-1 rounded-full border-primary/30 text-primary bg-primary/5 font-serif text-base tracking-wide"
          >
            {biz.tagline || "Est. 2024"}
          </Badge>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-foreground tracking-tight">
          {biz.name}
        </h1>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 opacity-50">
          <div className="h-px w-12 bg-primary" />
          <ChefHat className="w-6 h-6 text-primary" />
          <div className="h-px w-12 bg-primary" />
        </div>

        {/* Description */}
        {biz.description && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
            {biz.description}
          </p>
        )}

        {/* Contact Info Pills */}
        <div className="flex flex-wrap justify-center gap-3 text-sm pt-4">
          {biz.address && (
            <div className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{biz.address}</span>
            </div>
          )}
          {biz.phone && (
            <div className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{biz.phone}</span>
            </div>
          )}
          {biz.email && (
            <div className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>{biz.email}</span>
            </div>
          )}
        </div>

        {/* Socials */}
        {biz.social_links.length > 0 && (
          <div className="flex justify-center gap-3 pt-4">
            {biz.social_links.map((link) => (
              <Link key={link.id} href={link.url} target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <SocialIcon platform={link.platform} />
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

const MenuSection = ({
  title,
  items,
  type,
}: {
  title: string;
  items: (BizService | BizProduct)[];
  type: "service" | "product";
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-12 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground">
          {title}
        </h2>
        <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 max-w-5xl mx-auto">
        {items.map((item) => {
          const isService = type === "service";
          // Type narrowing helpers to avoid TS errors
          const stock = "stock" in item ? item.stock : 0;
          const duration =
            "duration_minutes" in item ? item.duration_minutes : 0;

          return (
            <div
              key={item.id}
              className="group flex gap-4 md:gap-6 items-start"
            >
              {/* Image / Avatar */}
              <div className="shrink-0 relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-sm bg-muted border-2 border-dashed border-primary/20 group-hover:border-primary transition-colors">
                  {item.image_url ? (
                    // Using standard img tag for simplicity, ideally use next/image
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/30">
                      {isService ? (
                        <Clock className="w-8 h-8" />
                      ) : (
                        <ShoppingBag className="w-8 h-8" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-baseline border-b border-dashed border-border/50 pb-2 mb-2">
                  <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-semibold text-lg text-primary whitespace-nowrap pl-4">
                    ${item.price}
                  </span>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-1">
                  {isService ? (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full font-normal"
                    >
                      {duration} mins
                    </Badge>
                  ) : stock > 0 ? (
                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />{" "}
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-destructive">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const TestimonialsSection = ({
  testimonials,
}: {
  testimonials: BizTestimonial[];
}) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-primary/5 rounded-[3rem] my-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <Quote className="w-10 h-10 text-primary/20 mx-auto fill-primary/20" />
          <h2 className="text-3xl font-serif">Sweet Words</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="bg-background border-none shadow-md rounded-2xl p-6 relative overflow-visible"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Avatar className="w-12 h-12 border-4 border-background shadow-sm">
                  {t.avatar_url && <AvatarImage src={t.avatar_url} />}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {t.author[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <CardContent className="pt-8 text-center space-y-4">
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < t.rating
                          ? "text-orange-400 fill-orange-400"
                          : "text-muted/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground italic text-sm leading-relaxed">
                  "{t.content}"
                </p>
                <div className="font-serif font-medium text-foreground pt-2">
                  — {t.author}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

const ContactSection = ({ biz }: { biz: BizData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Contact sent", data);
    toast.success("Message sent! We'll be in touch.");
    reset();
    setIsLoading(false);
  };

  return (
    <section className="py-16 max-w-2xl mx-auto">
      <Card className="border-2 border-dashed border-primary/20 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-serif text-3xl">
            Visit Us & Say Hello
          </CardTitle>
          <p className="text-muted-foreground">
            We accept custom orders and catering requests.
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-serif">
                  Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="rounded-xl border-primary/10 focus-visible:ring-primary/20"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-serif">
                  Email
                </Label>
                <Input
                  id="email"
                  {...register("email")}
                  className="rounded-xl border-primary/10 focus-visible:ring-primary/20"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="font-serif">
                Message
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                className="min-h-[120px] rounded-xl border-primary/10 focus-visible:ring-primary/20 resize-none"
              />
              {errors.message && (
                <p className="text-xs text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-full py-6 text-lg font-serif group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Send Message"
              )}
              {!isLoading && (
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

// --- Main Layout ---

export function DefaultBiz({ biz, themeMode, onSetThemeMode }: Props) {
  if (!biz) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Texture Overlay (Optional subtle grain) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <HeroSection
          biz={biz}
          themeMode={themeMode}
          onSetThemeMode={onSetThemeMode}
        />

        {/* Render Services as "Menu" */}
        {biz.services_enabled && biz.services.length > 0 && (
          <MenuSection
            title="Signature Services"
            items={biz.services}
            type="service"
          />
        )}

        {/* Render Products as "Menu" */}
        {biz.products_enabled && biz.products.length > 0 && (
          <MenuSection
            title="Fresh From the Oven"
            items={biz.products}
            type="product"
          />
        )}

        {biz.testimonials.length > 0 && (
          <TestimonialsSection testimonials={biz.testimonials} />
        )}

        <ContactSection biz={biz} />

        <footer className="text-center py-12 text-sm text-muted-foreground font-serif opacity-60">
          <p>
            © {new Date().getFullYear()} {biz.name}. Baked with love.
          </p>
        </footer>
      </div>
    </div>
  );
}
