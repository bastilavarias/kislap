"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-9 h-9 p-0"
      >
        <motion.div
          animate={{
            rotate: theme === "dark" ? -90 : 0,
            scale: theme === "dark" ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Sun className="h-4 w-4" />
        </motion.div>
        <motion.div
          className="absolute"
          animate={{
            rotate: theme === "dark" ? 0 : 90,
            scale: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Moon className="h-4 w-4" />
        </motion.div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
