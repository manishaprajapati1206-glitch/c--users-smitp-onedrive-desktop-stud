"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakWidgetProps {
    streakDays?: number;
    className?: string;
}

export function StreakWidget({ streakDays = 0, className }: StreakWidgetProps) {
    // Build last 7 days dynamically based on streak count
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const todayIndex = today.getDay(); // 0=Sun, 1=Mon, ...

    const days = Array.from({ length: 7 }, (_, i) => {
        // i=0 is 6 days ago, i=6 is today
        const daysAgo = 6 - i;
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);
        const label = dayLabels[date.getDay()];

        let status: "completed" | "missed" | "current";
        if (daysAgo === 0) {
            // Today — mark completed if streak >= 1 (they logged in today)
            status = streakDays >= 1 ? "current" : "current";
        } else if (daysAgo < streakDays) {
            // Within the streak window
            status = "completed";
        } else {
            status = "missed";
        }

        return { label, status, daysAgo };
    });

    return (
        <div className={cn(
            "relative overflow-hidden rounded-[2rem]",
            "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl",
            "dark:bg-black/10 dark:border-white/10",
            "p-8",
            className
        )}>
            {/* Glossy reflection/sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header: Number and Icon */}
                <div className="flex items-start gap-4 mb-8">
                    <span className="text-8xl font-bold tracking-tighter text-foreground leading-none">
                        {streakDays}
                    </span>
                    <div className="flex flex-col pt-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-2xl w-fit mb-1">
                            <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                        </div>
                        <span className="text-sm font-semibold text-foreground-muted leading-tight">
                            Current<br />streak
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-6" />

                {/* Days Grid */}
                <div className="flex justify-between items-center gap-2">
                    {days.map((day) => (
                        <div key={`${day.label}-${day.daysAgo}`} className="flex flex-col items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                day.status === "missed" && "border-2 border-dashed border-foreground/30",
                                day.status === "completed" && "bg-green-500 border-2 border-green-500 text-white",
                                day.status === "current" && "border-2 border-solid border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-110",
                            )}>
                                {day.status === "completed" && (
                                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                )}
                                {day.status === "current" && (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    </motion.div>
                                )}
                            </div>
                            <span className={cn(
                                "text-xs font-medium",
                                day.status === "missed" && "text-foreground-muted/50",
                                day.status === "completed" && "text-green-500 font-semibold",
                                day.status === "current" && "text-foreground font-bold"
                            )}>
                                {day.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
