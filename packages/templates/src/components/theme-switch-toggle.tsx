import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mode } from "@/contexts/settings-context";

interface Props {
  isDarkMode: Boolean;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

export function ThemeSwitchToggle({ isDarkMode, onSetThemeMode }: Props) {
  return (
    <Button
      onClick={() => onSetThemeMode(isDarkMode ? "light" : "dark")}
      className="relative flex items-center justify-between w-14 h-7 rounded-full bg-muted hover:bg-accent transition-colors p-1"
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-background shadow-md transition-transform ${
          isDarkMode ? "translate-x-7" : ""
        }`}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="ml-auto mr-1 text-slate-400"
          >
            <Moon size={16} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
            className="ml-1 text-amber-400"
          >
            <Sun size={16} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
