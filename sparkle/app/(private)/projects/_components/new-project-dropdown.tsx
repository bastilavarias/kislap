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
  { label: "Online Resume", emoji: "📄", url: "/projects/resume/new" },
  { label: "Business Website", emoji: "🏢", url: "/projects/resume/new" },
  { label: "Startup Waitlists", emoji: "🚀", url: "/projects/resume/new" },
  { label: "Link-in-bio Page", emoji: "🔗", url: "/projects/resume/new" },
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
