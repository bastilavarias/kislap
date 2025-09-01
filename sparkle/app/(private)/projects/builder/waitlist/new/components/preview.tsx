"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Preview() {
  const formData = {
    fullName: "Juan Dela Cruz",
    email: "juan@example.com",
    phone: "+63 912 345 6789",
    startupName: "NextGen Tech",
    industry: "SaaS",
    stage: "MVP",
    description: "We are building a platform to connect startups with early adopters.",
    needs: "Looking for mentors, early beta users, and seed funding.",
    launchDate: "2025-10-01",
    images: [
      "https://placehold.co/600x400?text=Screenshot+1",
      "https://placehold.co/600x400?text=Screenshot+2",
    ],
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">{formData.startupName}</h2>
        <p className="text-sm text-gray-500 mb-2">
          Founder: {formData.fullName} | Email: {formData.email}{" "}
          {formData.phone && `| Phone: ${formData.phone}`}
        </p>

        <div className="mb-4 flex gap-2">
          {formData.industry && <Badge variant="secondary">{formData.industry}</Badge>}
          {formData.stage && <Badge variant="secondary">{formData.stage}</Badge>}
        </div>

        <p className="mb-2">{formData.description}</p>
        <p className="mb-2 font-semibold">Needs: {formData.needs}</p>
        <p className="mb-4 text-gray-500">Expected Launch: {formData.launchDate}</p>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Screenshot ${idx + 1}`}
                className="w-full rounded border"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
