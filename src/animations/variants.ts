"use client";

import { Variants } from "framer-motion";

// Page transition variants
export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
        },
    },
};

// Stagger children animation
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// Fade up animation for items
export const fadeUpItem: Variants = {
    initial: {
        opacity: 0,
        y: 30,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
        },
    },
};

// Scale up animation
export const scaleUp: Variants = {
    initial: {
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
};

// Slide in from left
export const slideInLeft: Variants = {
    initial: {
        x: -100,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 25,
        },
    },
};

// Slide in from right
export const slideInRight: Variants = {
    initial: {
        x: 100,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 25,
        },
    },
};

// Card hover variants
export const cardHover: Variants = {
    rest: {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },
    hover: {
        scale: 1.02,
        rotateX: 2,
        rotateY: -2,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
    tap: {
        scale: 0.98,
    },
};

// Button press animation
export const buttonPress: Variants = {
    rest: {
        scale: 1,
    },
    hover: {
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17,
        },
    },
    tap: {
        scale: 0.95,
    },
};

// Flip card animation (for flashcards)
export const flipCard: Variants = {
    front: {
        rotateY: 0,
    },
    back: {
        rotateY: 180,
    },
};

// Celebration pop animation
export const celebrationPop: Variants = {
    initial: {
        scale: 0,
        opacity: 0,
    },
    animate: {
        scale: [0, 1.3, 1],
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

// Shake animation for wrong answers
export const shakeAnimation: Variants = {
    initial: {
        x: 0,
    },
    shake: {
        x: [-10, 10, -10, 10, -5, 5, 0],
        transition: {
            duration: 0.5,
        },
    },
};

// Progress bar fill
export const progressFill: Variants = {
    initial: {
        scaleX: 0,
        originX: 0,
    },
    animate: (progress: number) => ({
        scaleX: progress,
        transition: {
            duration: 1,
            ease: "easeOut",
        },
    }),
};

// Typewriter effect helper
export const typewriterContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.03,
        },
    },
};

export const typewriterChar: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};

// Modal backdrop
export const backdropVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

// Modal content
export const modalVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.9,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: {
            duration: 0.2,
        },
    },
};
