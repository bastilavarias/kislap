"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export function Features() {
  const features = [
    {
      title: "Business Websites",
      description:
        "Create a professional online presence for your business in just a few clicks.",
      icon: "🏢",
    },
    {
      title: "Resumes & Portfolios",
      description:
        "Turn your resume or portfolio into a modern website that stands out.",
      icon: "📄",
    },
    {
      title: "Startup Waitlists",
      description:
        "Launch your startup waitlist page instantly and start collecting signups.",
      icon: "🚀",
    },
    {
      title: "Link-in-Bio Pages",
      description:
        "Build your own Linktree-style landing page to share all your links in one place.",
      icon: "🔗",
    },
    {
      title: "Upcoming Features",
      description:
        "More templates and features are on the way to help you launch even faster.",
      icon: "✨",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Built for anyone</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deploy websites for your business, resume, startup waitlist, or
            Linktree, with more features on the way!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            /* Added staggered entrance animations for feature cards */
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-card border-border hover:border-accent/50 transition-colors h-full">
                <CardHeader>
                  <motion.div
                    className="text-3xl mb-2"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
