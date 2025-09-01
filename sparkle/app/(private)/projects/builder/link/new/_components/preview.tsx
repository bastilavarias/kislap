"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Github, Youtube, Link as LinkIcon, ExternalLink } from "lucide-react";

export function Preview() {
  // Static data from LinkTree Form
  const data = {
    fullName: "Jane Doe",
    bio: "Digital Creator | Developer | Tech Enthusiast",
    profileImageUrl: "https://placehold.co/160x160?text=Avatar",
    links: [
      { title: "Portfolio", url: "https://portfolio.com", icon: <LinkIcon className="w-4 h-4 mr-2" /> },
      { title: "YouTube", url: "https://youtube.com/channel/xyz", icon: <Youtube className="w-4 h-4 mr-2" /> },
      { title: "GitHub", url: "https://github.com/janedoe", icon: <Github className="w-4 h-4 mr-2" /> },
      { title: "External Site", url: "https://example.com", icon: <ExternalLink className="w-4 h-4 mr-2" /> },
    ],
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center space-y-4">
        <img
          src={data.profileImageUrl}
          alt={data.fullName}
          className="w-24 h-24 rounded-full border mb-2"
        />
        <h2 className="text-xl font-bold">{data.fullName}</h2>
        <p className="text-gray-500 text-center">{data.bio}</p>

        {/* Links */}
        <div className="flex flex-col w-full mt-4 gap-2">
          {data.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white py-2 rounded text-center flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              {link.icon}
              <span>{link.title}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
