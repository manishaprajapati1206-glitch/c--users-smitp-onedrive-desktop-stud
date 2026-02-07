"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
    front: string;
    back: string;
    className?: string;
}

export function Flashcard({ front, back, className }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={cn(
                "perspective-1000 cursor-pointer",
                className
            )}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="relative w-full h-48 transition-transform duration-500"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-purple p-6 flex flex-col items-center justify-center text-center text-white"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <span className="text-xs uppercase tracking-wider mb-2 opacity-70">Question</span>
                    <p className="text-lg font-medium">{front}</p>
                    <motion.div
                        className="absolute bottom-4 right-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <RotateCw className="w-5 h-5 opacity-50" />
                    </motion.div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-green to-brand-500 p-6 flex flex-col items-center justify-center text-center text-white"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <span className="text-xs uppercase tracking-wider mb-2 opacity-70">Answer</span>
                    <p className="text-lg font-medium">{back}</p>
                </div>
            </motion.div>

            <p className="text-center text-xs text-foreground-muted mt-3">
                Click to flip
            </p>
        </div>
    );
}

interface FlashcardGridProps {
    cards: Array<{ id: string; front: string; back: string }>;
}

export function FlashcardGrid({ cards }: FlashcardGridProps) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Flashcard front={card.front} back={card.back} />
                </motion.div>
            ))}
        </div>
    );
}

export default Flashcard;
