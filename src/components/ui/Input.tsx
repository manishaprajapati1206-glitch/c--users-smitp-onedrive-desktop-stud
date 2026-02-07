"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function Input({
    label,
    error,
    icon,
    className,
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted">
                        {icon}
                    </div>
                )}
                <input
                    className={cn(
                        "w-full px-4 py-3 rounded-xl",
                        "bg-card border border-card-border",
                        "text-foreground placeholder:text-foreground-muted",
                        "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent",
                        "transition-all duration-300",
                        "focus:scale-[1.01]",
                        icon && "pl-12",
                        error && "border-error focus:ring-error",
                        className
                    )}
                    {...props}
                />
                {/* Focus glow - using CSS instead */}
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: "0 0 20px rgba(14, 165, 233, 0.2)" }}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-error"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function TextArea({
    label,
    error,
    className,
    ...props
}: TextAreaProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                    {label}
                </label>
            )}
            <div className="relative group">
                <textarea
                    className={cn(
                        "w-full px-4 py-3 rounded-xl resize-none",
                        "bg-card border border-card-border",
                        "text-foreground placeholder:text-foreground-muted",
                        "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent",
                        "transition-all duration-300",
                        "focus:scale-[1.01]",
                        error && "border-error focus:ring-error",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-error"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}

export default Input;
