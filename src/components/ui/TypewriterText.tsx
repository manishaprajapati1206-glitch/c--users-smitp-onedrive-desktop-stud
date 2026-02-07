"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface TypewriterTextProps {
    text: string;
    className?: string;
    delay?: number;
    hideCursorAfterComplete?: boolean;
}

export function TypewriterText({ text, className, delay = 0, hideCursorAfterComplete = true }: TypewriterTextProps) {
    const count = useMotionValue(0);
    const displayText = useTransform(count, (latest) => text.slice(0, Math.round(latest)));
    const [showCaret, setShowCaret] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const controls = animate(count, text.length, {
                type: "tween",
                duration: text.length * 0.05,
                ease: "linear",
                onComplete: () => {
                    if (hideCursorAfterComplete) {
                        // Small delay before hiding caret for better effect
                        setTimeout(() => setShowCaret(false), 500);
                    }
                },
            });
            return controls.stop;
        }, delay * 1000);

        return () => clearTimeout(timeout);
    }, [count, text, delay, hideCursorAfterComplete]);

    return (
        <span className={className}>
            <motion.span>{displayText}</motion.span>
            {showCaret && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-[1em] bg-brand-400 ml-1 align-middle"
                />
            )}
        </span>
    );
}

interface AnimatedHeadlineProps {
    text: string;
    className?: string;
}

export function AnimatedHeadline({ text, className }: AnimatedHeadlineProps) {
    return (
        <motion.h1 initial="hidden" animate="visible" className={className}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    custom={i}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: (i: number) => ({
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: i * 0.03,
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                            },
                        }),
                    }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.h1>
    );
}

export default TypewriterText;

