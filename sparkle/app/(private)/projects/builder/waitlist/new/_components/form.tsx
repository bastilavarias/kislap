"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";

export function Form() {
  const [formData, setFormData] = useState({
    fullName: "Juan Dela Cruz",
    email: "juan@email.com",
    phone: "+63 900 000 0000",
    startupName: "My Startup",
    industry: "Tech",
    stage: "Idea",
    description: "We are building something amazing.",
    needs: "Funding, Mentorship",
    launchDate: "2025-12-31",
    consent: true,
    images: [
      "https://placehold.co/200x200",
      "https://placehold.co/300x200",
    ],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Images Stepper ---
  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, "https://placehold.co/200x200"],
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    console.log("Submit data:", formData);
    alert("Submitted! Check console for now.");
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold mb-6">Startup Waitlist</h2>

        {/* BASIC INFO */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label>Phone (optional)</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* STARTUP INFO */}
        <section className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-2">Startup Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Startup Name</Label>
              <Input
                value={formData.startupName}
                onChange={(e) => handleInputChange("startupName", e.target.value)}
              />
            </div>
            <div>
              <Label>Industry</Label>
              <Input
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
              />
            </div>
            <div>
              <Label>Stage</Label>
              <Input
                value={formData.stage}
                onChange={(e) => handleInputChange("stage", e.target.value)}
              />
            </div>
            <div>
              <Label>Expected Launch Date</Label>
              <Input
                type="date"
                value={formData.launchDate}
                onChange={(e) => handleInputChange("launchDate", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label>Short Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="h-24"
            />
          </div>
          <div className="mt-4">
            <Label>What do you need?</Label>
            <Textarea
              value={formData.needs}
              onChange={(e) => handleInputChange("needs", e.target.value)}
              className="h-20"
            />
          </div>
        </section>

        {/* IMAGES STEPPER */}
        <section className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-2">Startup Images (Optional)</h3>
          <div className="space-y-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={img}
                  onChange={(e) => updateImage(idx, e.target.value)}
                  placeholder="Image URL"
                />
                <Button variant="ghost" size="sm" onClick={() => removeImage(idx)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-2" onClick={addImage}>
            <Plus className="w-4 h-4 mr-2" /> Add Image
          </Button>
        </section>

        {/* CONSENT */}
        <section className="mb-6 border-t border-gray-200 pt-6 flex items-center gap-3">
          <Switch
            id="consent"
            checked={formData.consent}
            onCheckedChange={(v) => handleInputChange("consent", v)}
          />
          <Label htmlFor="consent">I agree to receive updates and offers</Label>
        </section>

        <Button onClick={handleSubmit}>Join Waitlist</Button>
      </CardContent>
    </Card>
  );
}
