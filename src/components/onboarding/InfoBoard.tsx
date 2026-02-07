"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Target, Trophy, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DepthLayer } from "@/components/effects/ParallaxContainer";

interface InfoBoardProps {
    onStart: () => void;
}

export function InfoBoard({ onStart }: InfoBoardProps) {
    const features = [
        {
            icon: Target,
            title: "Personalized Learning",
            description: "AI-powered courses tailored to your pace and style",
            color: "from-brand-400 to-brand-600",
        },
        {
            icon: Trophy,
            title: "Gamified Experience",
            description: "Earn XP, badges, and compete on leaderboards",
            color: "from-xp-gold to-yellow-500",
        },
        {
            icon: Users,
            title: "Community Support",
            description: "Connect with peers and share notes",
            color: "from-accent-purple to-accent-pink",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
        >
            {/* Top 50% - Info Board */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <DepthLayer depth={0.8} className="absolute top-10 left-10">
                        <div className="w-20 h-20 bg-brand-500/20 rounded-full blur-2xl" />
                    </DepthLayer>
                    <DepthLayer depth={0.6} className="absolute top-20 right-20">
                        <div className="w-32 h-32 bg-accent-purple/20 rounded-full blur-3xl" />
                    </DepthLayer>
                    <DepthLayer depth={0.4} className="absolute bottom-20 left-1/4">
                        <div className="w-24 h-24 bg-accent-pink/20 rounded-full blur-2xl" />
                    </DepthLayer>
                </div>

                {/* Content */}
                <motion.div
                    className="relative z-10 max-w-4xl mx-auto text-center"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Logo Animation */}
                    <motion.div
                        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500 via-accent-purple to-accent-pink mb-6"
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(14, 165, 233, 0.3)",
                                "0 0 40px rgba(168, 85, 247, 0.4)",
                                "0 0 20px rgba(14, 165, 233, 0.3)",
                            ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Sparkles className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        Welcome to{" "}
                        <span className="bg-gradient-to-r from-brand-400 via-accent-purple to-accent-pink bg-clip-text text-transparent">
                            SocraticAI
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-8">
                        Your journey to academic excellence starts here. Learn smarter, not harder,
                        with our gamified approach to education.
                    </p>

                    {/* Mission Statement */}
                    <motion.div
                        className="bg-card/80 backdrop-blur-xl border border-card-border rounded-2xl p-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Rocket className="w-6 h-6 text-brand-400" />
                            <h2 className="text-xl font-semibold">Our Mission</h2>
                        </div>
                        <p className="text-foreground-muted">
                            We believe learning should be fun, engaging, and rewarding. Our platform
                            transforms traditional education into an exciting adventure where every
                            lesson brings you closer to your goals.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        className="grid sm:grid-cols-3 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -4 }}
                                className="bg-card border border-card-border rounded-xl p-5"
                            >
                                <div
                                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-3`}
                                >
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-1">{feature.title}</h3>
                                <p className="text-sm text-foreground-muted">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Section - CTA */}
            <motion.div
                className="bg-gradient-to-t from-background via-background to-transparent py-12 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <div className="max-w-md mx-auto text-center">
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Button
                            onClick={onStart}
                            size="lg"
                            className="w-full text-lg py-6 animate-pulse-glow"
                        >
                            <Rocket className="w-6 h-6 mr-2" />
                            Start Your Journey Now
                            <ArrowRight className="w-6 h-6 ml-2" />
                        </Button>
                    </motion.div>

                    <p className="text-sm text-foreground-muted mt-4">
                        🎮 Join 10,000+ students already on their learning adventure!
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default InfoBoard;
