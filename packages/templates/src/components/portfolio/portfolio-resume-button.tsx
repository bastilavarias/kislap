import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function PortfolioResumeButton({
  resumeUrl,
  label = "Download Resume",
  className,
  variant = "outline",
  size = "sm",
}: {
  resumeUrl?: string | null;
  label?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  if (!resumeUrl) return null;

  return (
    <Button asChild variant={variant} size={size} className={cn("gap-2", className)}>
      <a href={resumeUrl} target="_blank" rel="noreferrer">
        <Download className="h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
