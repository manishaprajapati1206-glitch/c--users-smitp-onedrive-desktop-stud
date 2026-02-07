"use client";

import { Variants } from "framer-motion";

// Floating stationery item variants
export const floatingPencil: Variants = {
    initial: {
        y: 0,
        rotate: -15,
        opacity: 0,
    },
    animate: {
        y: [-20, 20, -20],
        rotate: [-15, -10, -15],
        opacity: 0.35,
        transition: {
            y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            },
            rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            },
            opacity: {
                duration: 1,
            },
        },
    },
};

export const floatingPen: Variants = {
    initial: {
        y: 0,
        rotate: 10,
        opacity: 0,
    },
    animate: {
        y: [10, -25, 10],
        rotate: [10, 20, 10],
        opacity: 0.3,
        transition: {
            y: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
            },
            rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            },
            opacity: {
                duration: 1,
            },
        },
    },
};

export const floatingEraser: Variants = {
    initial: {
        y: 0,
        rotate: 0,
        opacity: 0,
    },
    animate: {
        y: [-15, 15, -15],
        rotate: [0, 15, 0, -15, 0],
        opacity: 0.25,
        transition: {
            y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            },
            rotate: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
            },
            opacity: {
                duration: 1,
            },
        },
    },
};

export const floatingRuler: Variants = {
    initial: {
        y: 0,
        rotate: -5,
        opacity: 0,
    },
    animate: {
        y: [0, -30, 0],
        rotate: [-5, 5, -5],
        opacity: 0.2,
        transition: {
            y: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            },
            rotate: {
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
            },
            opacity: {
                duration: 1.5,
            },
        },
    },
};

export const floatingBook: Variants = {
    initial: {
        y: 0,
        rotateY: 0,
        opacity: 0,
    },
    animate: {
        y: [-10, 20, -10],
        rotateY: [0, 10, 0],
        opacity: 0.25,
        transition: {
            y: {
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
            },
            rotateY: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            },
            opacity: {
                duration: 1,
            },
        },
    },
};

// Stationery item positions configuration
export interface StationeryItem {
    type: "pencil" | "pen" | "eraser" | "ruler" | "book";
    position: { x: string; y: string };
    size: number;
    delay: number;
}

export const defaultStationeryItems: StationeryItem[] = [
    { type: "pencil", position: { x: "2%", y: "20%" }, size: 50, delay: 0 },
    { type: "pen", position: { x: "92%", y: "15%" }, size: 45, delay: 0.5 },
    { type: "eraser", position: { x: "3%", y: "75%" }, size: 35, delay: 1 },
    { type: "ruler", position: { x: "88%", y: "70%" }, size: 65, delay: 1.5 },
    { type: "book", position: { x: "95%", y: "45%" }, size: 55, delay: 2 },
    { type: "pencil", position: { x: "1%", y: "50%" }, size: 40, delay: 0.3 },
    { type: "pen", position: { x: "4%", y: "90%" }, size: 45, delay: 0.8 },
];
