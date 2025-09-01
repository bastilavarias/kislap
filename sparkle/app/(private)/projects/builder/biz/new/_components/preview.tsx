"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Preview() {
  const data = {
    businessName: "My Business",
    tagline: "Your success starts here",
    industry: "General Services",
    shortDescription: "We provide high-quality services to help your business grow.",
    logoUrl: "https://placehold.co/160x160",
    faviconUrl: "https://placehold.co/32",
    themeColor: "#2563eb",

    email: "business@email.com",
    phone: "+63 900 000 0000",
    address: "Mandaluyong City, NCR",
    businessHours: "Mon–Sat: 9AM–6PM",

    heroTitle: "Welcome to My Business",
    heroSubtitle: "Trusted by customers worldwide.",
    heroImageUrl: "https://placehold.co/1200x500",
    primaryCtaText: "Book Now",
    primaryCtaLink: "mailto:business@email.com",
    secondaryCtaText: "Learn More",
    secondaryCtaLink: "#about",

    aboutTitle: "About Us",
    about: "We are a passionate team delivering excellent results for our clients.",
    teamImageUrl: "https://placehold.co/800x500",
    highlights: ["10+ Years Experience", "Local & Friendly", "Fast Turnaround"],

    servicesTitle: "Our Services",
    services: [
      {
        title: "Web Development",
        description: "Custom websites tailored for your business.",
        imageUrl: "https://placehold.co/600x400",
        price: "$500+",
      },
      {
        title: "Digital Marketing",
        description: "Grow your reach and engage your customers.",
        imageUrl: "https://placehold.co/600x400",
        price: "$300+",
      },
    ],

    showcaseTitle: "Our Work",
    showcase: [
      { imageUrl: "https://placehold.co/600x400", caption: "E-commerce Site" },
      { imageUrl: "https://placehold.co/600x400", caption: "Portfolio Website" },
    ],

    testimonialsTitle: "What Clients Say",
    testimonials: [
      {
        name: "Juan D.",
        photoUrl: "https://placehold.co/80",
        text: "Great service and friendly team!",
        rating: 5,
      },
      {
        name: "Maria S.",
        photoUrl: "https://placehold.co/80",
        text: "They helped my business grow online!",
        rating: 5,
      },
    ],

    faqTitle: "FAQs",
    faqs: [
      { question: "Do you offer delivery?", answer: "Yes, within Metro Manila." },
      { question: "Do you provide support?", answer: "Yes, 24/7 online support." },
    ],

    ctaHeadline: "Ready to work with us?",
    ctaSubtext: "Get a free quote today.",
    ctaButtonText: "Contact Us",
    ctaButtonLink: "mailto:business@email.com",

    contactTitle: "Get In Touch",
    enableContactForm: true,
    mapEmbedUrl: "https://maps.google.com/",

    footerText: "© My Business 2025. All rights reserved.",
  }

  return (
    <Card>
      <CardContent className="p-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <img src={data.heroImageUrl} alt="Hero" className="w-full rounded-xl" />
          <h1 className="text-4xl font-bold">{data.heroTitle}</h1>
          <p className="text-lg text-gray-600">{data.heroSubtitle}</p>
          <div className="flex justify-center gap-4">
            <a href={data.primaryCtaLink}>
              <Button>{data.primaryCtaText}</Button>
            </a>
            <a href={data.secondaryCtaLink}>
              <Button variant="outline">{data.secondaryCtaText}</Button>
            </a>
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-4" id="about">
          <h2 className="text-3xl font-semibold">{data.aboutTitle}</h2>
          <p className="text-gray-600">{data.about}</p>
          <div className="flex flex-wrap gap-2">
            {data.highlights.map((h, i) => (
              <Badge key={i}>{h}</Badge>
            ))}
          </div>
          <img src={data.teamImageUrl} alt="Team" className="rounded-xl" />
        </section>

        {/* Services Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold">{data.servicesTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.services.map((s, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <img src={s.imageUrl} alt={s.title} className="rounded-lg" />
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="text-gray-600">{s.description}</p>
                  {s.price && <p className="font-semibold">{s.price}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Showcase Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">{data.showcaseTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.showcase.map((item, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <img src={item.imageUrl} alt={item.caption} className="rounded-t-lg" />
                  <p className="p-4 text-center text-gray-600">{item.caption}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">{data.testimonialsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.testimonials.map((t, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={t.photoUrl} alt={t.name} className="rounded-full w-16 h-16" />
                    <h3 className="font-bold">{t.name}</h3>
                  </div>
                  <p className="italic text-gray-600">“{t.text}”</p>
                  <p>{"★".repeat(t.rating)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">{data.faqTitle}</h2>
          <div className="space-y-4">
            {data.faqs.map((f, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <h3 className="font-semibold">Q: {f.question}</h3>
                <p className="text-gray-600">A: {f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{data.ctaHeadline}</h2>
          <p className="text-gray-600">{data.ctaSubtext}</p>
          <a href={data.ctaButtonLink}>
            <Button size="lg">{data.ctaButtonText}</Button>
          </a>
        </section>

        {/* Contact Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">{data.contactTitle}</h2>
          <p>Email: {data.email}</p>
          <p>Phone: {data.phone}</p>
          <p>Address: {data.address}</p>
          <p>Hours: {data.businessHours}</p>
          {data.enableContactForm && (
            <form className="space-y-4 max-w-md">
              <input type="text" placeholder="Name" className="w-full border p-2 rounded" />
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
              <textarea placeholder="Message" className="w-full border p-2 rounded" rows={4}></textarea>
              <Button type="submit">Send Message</Button>
            </form>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 border-t pt-6">
          <p>{data.footerText}</p>
        </footer>
      </CardContent>
    </Card>
  )
}
