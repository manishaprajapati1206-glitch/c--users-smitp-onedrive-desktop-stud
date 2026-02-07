"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RippleProps {
    x: number;
    y: number;
    size: number;
}

interface ButtonProps {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export function Button({
    variant = "primary",
    size = "md",
    className,
    children,
    onClick,
    disabled,
    type = "button",
}: ButtonProps) {
    const [ripples, setRipples] = useState<RippleProps[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const createRipple = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            const button = buttonRef.current;
            if (!button || disabled) return;

            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const size = Math.max(rect.width, rect.height);

            const newRipple = { x, y, size };
            setRipples((prev) => [...prev, newRipple]);

            // Remove ripple after animation
            setTimeout(() => {
                setRipples((prev) => prev.slice(1));
            }, 600);
        },
        [disabled]
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        createRipple(event);
        onClick?.(event);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        button.style.setProperty('--mouse-x', `${x}%`);
        button.style.setProperty('--mouse-y', `${y}%`);
    };

    const variants = {
        primary:
            "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25",
        secondary:
            "bg-gradient-to-r from-accent-purple to-accent-pink text-white hover:opacity-90 shadow-lg shadow-accent-purple/25",
        outline:
            "border-2 border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400 hover:bg-brand-600 dark:hover:bg-brand-400 hover:text-white",
        ghost:
            "text-foreground-muted hover:text-foreground hover:bg-foreground/5",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            ref={buttonRef}
            type={type}
            className={cn(
                "relative overflow-hidden rounded-xl font-semibold transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "metallic-button",
                variants[variant],
                sizes[size],
                className
            )}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
            {/* Ripple effects */}
            {ripples.map((ripple, index) => (
                <span
                    key={index}
                    className="ripple-effect"
                    style={{
                        left: ripple.x - ripple.size / 2,
                        top: ripple.y - ripple.size / 2,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}
            <span className="relative z-10 flex items-center justify-center">
                {children}
            </span>
        </motion.button>
    );
}

export default Button;

