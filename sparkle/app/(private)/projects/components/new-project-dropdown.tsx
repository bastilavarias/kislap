"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const projectTypes = [
  { label: "Online Resume", emoji: "📄", url: "/projects/builder/resume/new" },
  { label: "Business Website", emoji: "🏢", url: "/projects/builder/biz/new" },
  { label: "Startup Waitlists", emoji: "🚀", url: "/projects/builder/waitlist/new" },
  { label: "Link-in-bio Page", emoji: "🔗", url: "/projects/builder/link/new" },
];

export function NewProjectDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="font-bold">NEW PROJECT</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" side="left" align="start">
        {projectTypes.map((project) => (
          <DropdownMenuItem key={project.label} asChild>
            <Link href={project.url}>
              <span className="mr-2">{project.emoji}</span>
              {project.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
