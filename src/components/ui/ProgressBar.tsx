"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress: number; // 0-100
    className?: string;
    showLabel?: boolean;
    color?: "brand" | "success" | "warning" | "accent";
    size?: "sm" | "md" | "lg";
    animated?: boolean;
}

export function ProgressBar({
    progress,
    className,
    showLabel = false,
    color = "brand",
    size = "md",
    animated = true,
}: ProgressBarProps) {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    const colors = {
        brand: "from-brand-400 to-brand-600",
        success: "from-green-400 to-green-600",
        warning: "from-yellow-400 to-orange-500",
        accent: "from-accent-purple to-accent-pink",
    };

    const sizes = {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
    };

    return (
        <div className={cn("w-full", className)}>
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-foreground-muted">Progress</span>
                    <span className="text-sm font-semibold text-foreground">
                        {Math.round(clampedProgress)}%
                    </span>
                </div>
            )}
            <div
                className={cn(
                    "w-full bg-card-border rounded-full overflow-hidden",
                    sizes[size]
                )}
            >
                <motion.div
                    className={cn(
                        "h-full rounded-full bg-gradient-to-r",
                        colors[color]
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: clampedProgress / 100 }}
                    style={{ originX: 0 }}
                    transition={
                        animated
                            ? { type: "spring", stiffness: 100, damping: 20 }
                            : { duration: 0 }
                    }
                />
            </div>
        </div>
    );
}

interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: "brand" | "success" | "accent";
    showLabel?: boolean;
}

export function CircularProgress({
    progress,
    size = 80,
    strokeWidth = 8,
    color = "brand",
    showLabel = true,
}: CircularProgressProps) {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    const colors = {
        brand: "stroke-brand-500",
        success: "stroke-success",
        accent: "stroke-accent-purple",
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-card-border"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    className={colors[color]}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{Math.round(clampedProgress)}%</span>
                </div>
            )}
        </div>
    );
}

export default ProgressBar;
