'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Container } from '@/components/container';

export function Hero() {
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Badge variant="secondary" className="mb-6 text-sm">
          🎉 Kislap is built by Community
        </Badge>
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        ✨Transform your forms into <span className="gradient-text">beautiful websites. </span>
      </motion.h1>

      <motion.p
        className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Easily convert your forms into modern, responsive websites in seconds.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            Start Building
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            I want to learn more!
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
}
