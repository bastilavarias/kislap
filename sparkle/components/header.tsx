import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div>
              ✨<span className="text-xl font-black">SPARKLE</span>✨
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              v0.0.0
            </Badge>
          </div>
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
          <Button variant="outline" size="sm">
            Docs
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
}
