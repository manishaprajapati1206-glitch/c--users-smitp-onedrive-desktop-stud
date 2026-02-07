"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    floatingPencil,
    floatingPen,
    floatingEraser,
    floatingRuler,
    floatingBook,
    defaultStationeryItems,
    type StationeryItem,
} from "@/animations/floating-items";

// SVG Icons for stationery items
const PencilIcon = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M50 10L54 14L20 48L14 50L16 44L50 10Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="2"
        />
        <path d="M14 50L16 44L20 48L14 50Z" fill="#FCD34D" />
        <path d="M50 10L54 14L51 17L47 13L50 10Z" fill="#EC4899" />
    </svg>
);

const PenIcon = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M48 8L56 16L22 50L10 54L14 42L48 8Z"
            fill="#3B82F6"
            stroke="#2563EB"
            strokeWidth="2"
        />
        <path d="M10 54L14 42L22 50L10 54Z" fill="#60A5FA" />
        <path d="M12 56L10 54L14 42L12 56Z" fill="#1F2937" />
    </svg>
);

const EraserIcon = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="12"
            y="24"
            width="40"
            height="20"
            rx="4"
            fill="#EC4899"
            stroke="#DB2777"
            strokeWidth="2"
        />
        <rect x="12" y="24" width="12" height="20" rx="4" fill="#F472B6" />
        <line x1="24" y1="24" x2="24" y2="44" stroke="#DB2777" strokeWidth="2" />
    </svg>
);

const RulerIcon = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="8"
            y="22"
            width="48"
            height="20"
            rx="2"
            fill="#8B5CF6"
            stroke="#7C3AED"
            strokeWidth="2"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line
                key={i}
                x1={14 + i * 6}
                y1="22"
                x2={14 + i * 6}
                y2={i % 2 === 0 ? 32 : 28}
                stroke="#DDD6FE"
                strokeWidth="1"
            />
        ))}
    </svg>
);

const BookIcon = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10 14H30V50H14C11.8 50 10 48.2 10 46V14Z"
            fill="#22C55E"
            stroke="#16A34A"
            strokeWidth="2"
        />
        <path
            d="M30 14H54V46C54 48.2 52.2 50 50 50H30V14Z"
            fill="#4ADE80"
            stroke="#16A34A"
            strokeWidth="2"
        />
        <line x1="30" y1="14" x2="30" y2="50" stroke="#16A34A" strokeWidth="2" />
        <line x1="16" y1="24" x2="24" y2="24" stroke="#BBF7D0" strokeWidth="2" />
        <line x1="16" y1="30" x2="24" y2="30" stroke="#BBF7D0" strokeWidth="2" />
    </svg>
);

const stationeryIcons = {
    pencil: PencilIcon,
    pen: PenIcon,
    eraser: EraserIcon,
    ruler: RulerIcon,
    book: BookIcon,
};

const stationeryVariants = {
    pencil: floatingPencil,
    pen: floatingPen,
    eraser: floatingEraser,
    ruler: floatingRuler,
    book: floatingBook,
};

interface FloatingStationeryProps {
    items?: StationeryItem[];
    className?: string;
}

export function FloatingStationery({
    items = defaultStationeryItems,
    className,
}: FloatingStationeryProps) {
    return (
        <div
            className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
        >
            {items.map((item, index) => {
                const Icon = stationeryIcons[item.type];
                const variants = stationeryVariants[item.type];

                return (
                    <motion.div
                        key={`${item.type}-${index}`}
                        className="absolute"
                        style={{
                            left: item.position.x,
                            top: item.position.y,
                        }}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: item.delay }}
                    >
                        <Icon size={item.size} />
                    </motion.div>
                );
            })}
        </div>
    );
}

export default FloatingStationery;
