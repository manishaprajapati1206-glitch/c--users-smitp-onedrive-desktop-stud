"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { calculateMouseParallax, calculate3DRotation } from "@/animations/parallax";

interface ParallaxContainerProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number; // 0-1, default 0.5
}

export function ParallaxContainer({
    children,
    className,
    intensity = 0.5,
}: ParallaxContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const parallax = calculateMouseParallax(
        mousePosition.x,
        mousePosition.y,
        containerSize.width,
        containerSize.height,
        { strength: intensity }
    );

    const springConfig = { stiffness: 150, damping: 20 };
    const x = useSpring(parallax.x, springConfig);
    const y = useSpring(parallax.y, springConfig);

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden", className)}
            onMouseMove={handleMouseMove}
        >
            <motion.div style={{ x, y }}>{children}</motion.div>
        </div>
    );
}

interface DepthLayerProps {
    children: React.ReactNode;
    depth: number; // 0 = foreground (moves most), 1 = background (moves least)
    className?: string;
}

export function DepthLayer({ children, depth, className }: DepthLayerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const yRange = 100 * (1 - depth);
    const y = useTransform(scrollYProgress, [0, 1], [yRange, -yRange]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <motion.div ref={ref} className={cn("relative", className)} style={{ y: smoothY }}>
            {children}
        </motion.div>
    );
}

interface Card3DProps {
    children: React.ReactNode;
    className?: string;
    maxRotation?: number;
}

export function Card3D({ children, className, maxRotation = 10 }: Card3DProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const newRotation = calculate3DRotation(e.clientX, e.clientY, rect, maxRotation);
        setRotation(newRotation);
    };

    const handleMouseLeave = () => {
        setRotation({ rotateX: 0, rotateY: 0 });
    };

    const springConfig = { stiffness: 300, damping: 25 };
    const rotateX = useSpring(rotation.rotateX, springConfig);
    const rotateY = useSpring(rotation.rotateY, springConfig);

    return (
        <motion.div
            ref={cardRef}
            className={cn("transform-gpu", className)}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
}

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({
    children,
    className,
    direction = "up",
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

    // Calculate offset based on direction
    const isVertical = direction === "up" || direction === "down";
    const offsetValue = direction === "up" || direction === "left" ? 50 : -50;

    // Both transforms are created unconditionally to satisfy hooks rules
    const yTransform = useTransform(scrollYProgress, [0, 1], [isVertical ? offsetValue : 0, 0]);
    const xTransform = useTransform(scrollYProgress, [0, 1], [!isVertical ? offsetValue : 0, 0]);

    const smoothY = useSpring(yTransform, { stiffness: 100, damping: 30 });
    const smoothX = useSpring(xTransform, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                opacity,
                y: isVertical ? smoothY : 0,
                x: !isVertical ? smoothX : 0,
            }}
        >
            {children}
        </motion.div>
    );
}

export default ParallaxContainer;
