import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoVersion } from "@/components/logo-version";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <LogoVersion />
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              What&#39;s this?
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/docs">Docs</Link>
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
