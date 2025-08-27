"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Zed is the fastest editor I've ever used. The multiplayer features are game-changing for our team.",
      author: "Sarah Chen",
      role: "Senior Engineer at Stripe",
      avatar: "/professional-woman-developer.png",
    },
    {
      quote:
        "Finally, an editor that keeps up with my thoughts. The AI assistance is incredibly helpful.",
      author: "Marcus Rodriguez",
      role: "Tech Lead at Vercel",
      avatar: "/professional-man-developer.png",
    },
    {
      quote:
        "The Vim integration is flawless. It's like they built it specifically for modal editing enthusiasts.",
      author: "Alex Kim",
      role: "Principal Engineer at GitHub",
      avatar: "/professional-developer.png",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">💖Loved by Everyone💖</h2>
          <p className="text-xl text-muted-foreground">
            Join the smart people who use Kislap to get things done.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="bg-card border-border h-full">
                <CardContent className="p-6">
                  <motion.blockquote
                    className="text-foreground mb-4 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    "{testimonial.quote}"
                  </motion.blockquote>
                  <motion.div
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
