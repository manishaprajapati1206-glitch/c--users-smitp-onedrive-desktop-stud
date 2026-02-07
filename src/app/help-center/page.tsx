"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, MessageCircle, HelpCircle, FileText } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { FloatingStationery } from "@/components/effects/FloatingStationery";

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const faqs = [
        {
            title: "How do I earn XP?",
            content: "You earn XP by completing lessons, taking quizzes, and maintaining your daily streak. Higher scores on quizzes award more XP!"
        },
        {
            title: "Can I download courses offline?",
            content: "Yes, Pro members can download course materials and videos for offline viewing via the mobile app."
        },
        {
            title: "How do streaks work?",
            content: "Your streak increases every day you complete at least one lesson or quiz. If you miss a day, you can use a Streak Freeze to save it."
        },
        {
            title: "Is there a student discount?",
            content: "We offer 50% off for verified students. Navigate to Settings > Billing and upload your student ID to apply."
        }
    ];

    const contactOptions = [
        { icon: MessageCircle, title: "Live Chat", desc: "Wait time: < 2 min", action: "Start Chat" },
        { icon: Mail, title: "Email Support", desc: "Response within 24h", action: "Send Email" },
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-12">
            <FloatingStationery />

            {/* Hero Section */}
            <div className="relative bg-brand-500 text-white py-16 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
                        <p className="text-white/80 mb-8 text-lg">Search for answers or browse common questions below.</p>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search help articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-foreground bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-brand-500" /> Frequently Asked Questions
                    </h2>
                    <div className="bg-card border border-card-border rounded-2xl p-2 shadow-sm">
                        <Accordion items={faqs} className="px-4" />
                    </div>
                </motion.div>

                {/* Contact Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold mb-6">Still need help?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {contactOptions.map((opt, i) => (
                            <div key={opt.title} className="bg-card border border-card-border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center hover:border-brand-400 transition-colors">
                                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-500">
                                    <opt.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">{opt.title}</h3>
                                <p className="text-foreground-muted mb-4">{opt.desc}</p>
                                <Button variant="outline" className="w-full">{opt.action}</Button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
