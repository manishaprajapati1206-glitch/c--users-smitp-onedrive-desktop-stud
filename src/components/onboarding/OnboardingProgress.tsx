"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
    currentStep: number;
    totalSteps: number;
    labels?: string[];
}

export function OnboardingProgress({
    currentStep,
    totalSteps,
    labels,
}: OnboardingProgressProps) {
    const defaultLabels = ["Account", "Profile", "Interests", "Dashboard", "Ready!"];
    const stepLabels = labels || defaultLabels.slice(0, totalSteps);

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            {/* Progress Bar */}
            <div className="relative h-2 bg-card-border rounded-full overflow-hidden mb-4">
                <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-500 to-accent-purple rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between">
                {stepLabels.map((label, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={label} className="flex flex-col items-center">
                            <motion.div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                                    isCompleted && "bg-brand-500 text-white",
                                    isCurrent && "bg-gradient-to-r from-brand-500 to-accent-purple text-white",
                                    !isCompleted && !isCurrent && "bg-card-border text-foreground-muted"
                                )}
                                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                            >
                                {isCompleted ? "✓" : index + 1}
                            </motion.div>
                            <span
                                className={cn(
                                    "text-xs mt-2 hidden sm:block",
                                    isCurrent ? "text-brand-400 font-medium" : "text-foreground-muted"
                                )}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OnboardingProgress;
