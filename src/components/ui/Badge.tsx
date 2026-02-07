"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trophy, Star, Zap, Target, BookOpen, Award } from "lucide-react";

interface BadgeProps {
    variant?: "xp" | "streak" | "achievement" | "level" | "course" | "default" | "info" | "warning" | "success" | "pro";
    children: React.ReactNode;
    className?: string;
    pulse?: boolean;
    icon?: boolean;
}

export function Badge({
    variant = "default",
    children,
    className,
    pulse = false,
    icon = true,
}: BadgeProps) {
    const variants = {
        xp: {
            bg: "bg-gradient-to-r from-xp-gold/20 to-yellow-500/20",
            border: "border-xp-gold/50",
            text: "text-yellow-600 dark:text-xp-gold",
            Icon: Star,
        },
        streak: {
            bg: "bg-gradient-to-r from-streak-fire/20 to-orange-500/20",
            border: "border-streak-fire/50",
            text: "text-orange-600 dark:text-streak-fire",
            Icon: Zap,
        },
        achievement: {
            bg: "bg-gradient-to-r from-accent-purple/20 to-accent-pink/20",
            border: "border-accent-purple/50",
            text: "text-purple-600 dark:text-accent-purple",
            Icon: Trophy,
        },
        level: {
            bg: "bg-gradient-to-r from-brand-500/20 to-brand-600/20",
            border: "border-brand-500/50",
            text: "text-brand-700 dark:text-brand-400",
            Icon: Target,
        },
        course: {
            bg: "bg-gradient-to-r from-accent-green/20 to-green-500/20",
            border: "border-accent-green/50",
            text: "text-green-700 dark:text-accent-green",
            Icon: BookOpen,
        },
        default: {
            bg: "bg-card",
            border: "border-card-border",
            text: "text-foreground",
            Icon: Award,
        },
        info: {
            bg: "bg-gradient-to-r from-blue-500/20 to-sky-500/20",
            border: "border-blue-500/50",
            text: "text-blue-700 dark:text-blue-400",
            Icon: BookOpen,
        },
        warning: {
            bg: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20",
            border: "border-amber-500/50",
            text: "text-amber-700 dark:text-amber-400",
            Icon: Zap,
        },
        success: {
            bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
            border: "border-green-500/50",
            text: "text-green-700 dark:text-green-400",
            Icon: Award,
        },
        pro: {
            bg: "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20",
            border: "border-violet-500/50",
            text: "text-violet-700 dark:text-violet-400",
            Icon: Zap,
        },
    };

    const { bg, border, text, Icon } = variants[variant] || variants.default;

    return (
        <motion.span
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                "border backdrop-blur-sm",
                bg,
                border,
                text,
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {icon && <Icon className="w-3.5 h-3.5" />}
            {children}
            {pulse && (
                <motion.span
                    className={cn("w-2 h-2 rounded-full", text.replace("text-", "bg-"))}
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}
        </motion.span>
    );
}

interface AchievementBadgeProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    unlocked?: boolean;
}

export function AchievementBadge({
    title,
    description,
    icon,
    unlocked = true,
}: AchievementBadgeProps) {
    return (
        <motion.div
            className={cn(
                "relative flex flex-col items-center p-4 rounded-2xl",
                "bg-card border border-card-border",
                !unlocked && "opacity-50 grayscale"
            )}
            whileHover={unlocked ? { scale: 1.05, y: -4 } : undefined}
        >
            <motion.div
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center",
                    unlocked
                        ? "bg-gradient-to-br from-xp-gold to-yellow-500"
                        : "bg-card-border"
                )}
                animate={unlocked ? { rotate: [0, 5, -5, 0] } : undefined}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {icon || <Trophy className="w-8 h-8 text-white" />}
            </motion.div>
            <h4 className="mt-3 font-semibold text-sm">{title}</h4>
            {description && (
                <p className="mt-1 text-xs text-foreground-muted text-center">
                    {description}
                </p>
            )}
            {unlocked && (
                <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <span className="text-white text-xs">✓</span>
                </motion.div>
            )}
        </motion.div>
    );
}

export default Badge;
