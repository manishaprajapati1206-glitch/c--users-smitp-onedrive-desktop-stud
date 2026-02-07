"use client";

import { MotionValue, useTransform } from "framer-motion";

// Parallax configuration for depth layers
export interface ParallaxLayerConfig {
    depth: number; // 0 = closest (moves most), 1 = furthest (moves least)
    scale?: number;
}

// Create parallax transform based on scroll progress
export function useParallaxTransform(
    scrollProgress: MotionValue<number>,
    config: ParallaxLayerConfig
) {
    const { depth } = config;

    // Items closer (lower depth) move more
    const yRange = 100 * (1 - depth);

    const y = useTransform(
        scrollProgress,
        [0, 1],
        [yRange, -yRange]
    );

    const scale = useTransform(
        scrollProgress,
        [0, 0.5, 1],
        [1, config.scale ?? 1, 1]
    );

    return { y, scale };
}

// Mouse-based parallax configuration
export interface MouseParallaxConfig {
    strength: number; // How much the element moves (0-1)
    invert?: boolean; // Move opposite to mouse direction
}

// Calculate parallax offset based on mouse position
export function calculateMouseParallax(
    mouseX: number,
    mouseY: number,
    containerWidth: number,
    containerHeight: number,
    config: MouseParallaxConfig
) {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    const offsetX = (mouseX - centerX) / centerX;
    const offsetY = (mouseY - centerY) / centerY;

    const multiplier = config.invert ? -1 : 1;
    const strength = config.strength * 50; // Max 50px movement

    return {
        x: offsetX * strength * multiplier,
        y: offsetY * strength * multiplier,
    };
}

// 3D rotation based on mouse position
export function calculate3DRotation(
    mouseX: number,
    mouseY: number,
    elementRect: DOMRect,
    maxRotation: number = 10
) {
    const centerX = elementRect.left + elementRect.width / 2;
    const centerY = elementRect.top + elementRect.height / 2;

    const percentX = (mouseX - centerX) / (elementRect.width / 2);
    const percentY = (mouseY - centerY) / (elementRect.height / 2);

    return {
        rotateX: -percentY * maxRotation,
        rotateY: percentX * maxRotation,
    };
}

// Depth layer presets
export const depthLayers = {
    foreground: { depth: 0.2, scale: 1.05 },
    midground: { depth: 0.5, scale: 1 },
    background: { depth: 0.8, scale: 0.95 },
    farBackground: { depth: 0.95, scale: 0.9 },
};
