"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

export function Form() {
  const [formData, setFormData] = useState({
    fullName: "Jane Doe",
    bio: "Digital Creator | Developer | Tech Enthusiast",
    profileImageUrl: "https://placehold.co/160x160?text=Avatar",
    links: [
      { title: "Portfolio", url: "https://portfolio.com", iconUrl: "" },
      { title: "YouTube", url: "https://youtube.com/channel/xyz", iconUrl: "" },
    ],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { title: "New Link", url: "", iconUrl: "" }],
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold mb-8">LinkTree Generator</h2>

        {/* Personal Info */}
        <div className="mb-8">
          <Label className="font-medium mb-1">Full Name</Label>
          <Input
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
        </div>

        <div className="mb-8">
          <Label className="font-medium mb-1">Bio</Label>
          <Textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="h-20"
          />
        </div>

        <div className="mb-8">
          <Label className="font-medium mb-1">Profile Image URL</Label>
          <Input
            value={formData.profileImageUrl}
            onChange={(e) => handleInputChange("profileImageUrl", e.target.value)}
          />
        </div>

        {/* Links Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Links</h3>
          {formData.links.map((link, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 mb-2 items-start">
              <Input
                placeholder="Title"
                value={link.title}
                onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Icon URL"
                value={link.iconUrl}
                onChange={(e) => handleLinkChange(index, "iconUrl", e.target.value)}
                className="flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeLink(index)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addLink} className="mt-2">
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
