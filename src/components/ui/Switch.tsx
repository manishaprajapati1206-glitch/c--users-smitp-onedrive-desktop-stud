"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
}

export function Switch({ checked, onCheckedChange, className }: SwitchProps) {
    return (
        <motion.button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                checked ? "bg-brand-500" : "bg-card-border",
                className
            )}
            whileTap={{ scale: 0.9 }}
        >
            <motion.span
                className={cn(
                    "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0"
                )}
                animate={{ x: checked ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </motion.button>
    );
}
