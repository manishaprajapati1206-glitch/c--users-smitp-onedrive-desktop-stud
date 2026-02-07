"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHover } from "@/animations/variants";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover3D?: boolean;
    onClick?: () => void;
}

export function Card({ children, className, hover3D = true, onClick }: CardProps) {
    return (
        <motion.div
            className={cn(
                "relative rounded-2xl bg-card border border-card-border p-6",
                "backdrop-blur-sm overflow-hidden",
                onClick && "cursor-pointer",
                className
            )}
            variants={hover3D ? cardHover : undefined}
            initial="rest"
            whileHover="hover"
            whileTap={onClick ? "tap" : undefined}
            onClick={onClick}
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* Gradient overlay on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-transparent to-accent-purple/0 opacity-0 pointer-events-none"
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>

            {/* Corner glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}

export function GlassCard({ children, className, onClick }: CardProps) {
    return (
        <motion.div
            className={cn(
                "relative rounded-2xl p-6 overflow-hidden",
                "bg-white/10 dark:bg-white/5",
                "backdrop-blur-xl",
                "border border-white/20 dark:border-white/10",
                onClick && "cursor-pointer",
                className
            )}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}

export default Card;
