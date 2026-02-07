"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-12 h-12 rounded-full bg-card border border-card-border" />
        );
    }

    const isDark = theme === "dark";

    return (
        <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-12 h-12 rounded-full bg-card border border-card-border
                 flex items-center justify-center overflow-hidden
                 hover:border-brand-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? 0 : 180,
                    scale: isDark ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
            >
                <Moon className="w-5 h-5 text-accent-purple" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? -180 : 0,
                    scale: isDark ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
            >
                <Sun className="w-5 h-5 text-orange-500" />
            </motion.div>

            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                    boxShadow: isDark
                        ? "0 0 20px rgba(168, 85, 247, 0.3)"
                        : "0 0 20px rgba(234, 179, 8, 0.3)",
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}

export default ThemeToggle;
