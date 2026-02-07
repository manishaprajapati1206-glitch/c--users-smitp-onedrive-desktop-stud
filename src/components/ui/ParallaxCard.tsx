"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    gradient?: string;
}

export function ParallaxCard({ children, className, onClick, gradient }: ParallaxCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

    useEffect(() => {
        setParticles(
            Array.from({ length: 8 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 1,
                duration: Math.random() * 20 + 10,
            }))
        );
    }, []);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative h-full w-full rounded-2xl cursor-pointer transition-all duration-200 ease-out",
                "perspective-1000",
                className
            )}
        >
            <div
                style={{ transform: "translateZ(50px)" }}
                className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-br p-6 shadow-xl",
                    "flex flex-col justify-between overflow-hidden",
                    "backface-hidden", // Solid background base
                    gradient ? "text-white" : "text-foreground", // Adapt text color
                    gradient || "bg-card" // Default to card bg if no gradient
                )}
            >
                {/* Floating Particles Background */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute rounded-full bg-white blur-[1px]"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: p.size,
                                height: p.size,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                x: [0, 10, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Content Layer - Pushed forward in Z-space */}
                <div
                    className="relative z-10 transform-gpu"
                    style={{ transform: "translateZ(30px)" }}
                >
                    {children}
                </div>

                {/* Glossy Sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-20" />
            </div>
        </motion.div>
    );
}
