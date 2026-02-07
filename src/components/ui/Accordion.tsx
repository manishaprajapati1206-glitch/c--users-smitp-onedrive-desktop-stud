"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
    className?: string;
}

export function AccordionItem({ title, children, isOpen, onToggle, className }: AccordionItemProps) {
    return (
        <div className={cn("border-b border-card-border last:border-0", className)}>
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-brand-500"
            >
                {title}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-5 w-5 text-foreground-muted" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 pt-0 text-foreground-muted">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface AccordionProps {
    items: { title: string; content: React.ReactNode }[];
    className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className={cn("w-full", className)}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
}
