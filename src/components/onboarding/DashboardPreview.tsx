"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserCircle, BarChart3, Users, Settings, Check, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CircularProgress } from "@/components/ui/ProgressBar";

interface DashboardPreviewProps {
    userName: string;
    onContinue: () => void;
    onDashboardAction?: (action: string) => void;
}

export function DashboardPreview({ userName, onContinue, onDashboardAction }: DashboardPreviewProps) {
    const dashboardItems = [
        { icon: UserCircle, label: "Edit Profile", color: "text-brand-400", action: "profile" },
        { icon: BarChart3, label: "Progress Report", color: "text-accent-green", action: "progress" },
        { icon: Settings, label: "Settings", color: "text-foreground-muted", action: "settings" },
        { icon: Trophy, label: "Leaderboard", color: "text-amber-500", action: "leaderboard" },
    ];

    const handleItemClick = (action: string) => {
        if (onDashboardAction) {
            onDashboardAction(action);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-2xl mx-auto"
        >
            {/* Profile Completion Animation */}
            <motion.div
                className="text-center mb-8"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                <motion.div
                    className="relative inline-block mb-6"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <CircularProgress progress={100} size={120} color="success" />
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                    >
                        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-2xl font-bold mb-2">
                        Welcome aboard, {userName}! 🎉
                    </h2>
                    <p className="text-foreground-muted">
                        Your profile is complete. Here&apos;s your dashboard!
                    </p>
                </motion.div>

                {/* Badges */}
                <motion.div
                    className="flex items-center justify-center gap-3 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Badge variant="xp">+50 XP</Badge>
                    <Badge variant="achievement">🏆 First Steps</Badge>
                </motion.div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
                className="bg-card border border-card-border rounded-2xl p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <h3 className="text-lg font-semibold mb-4">Your Dashboard</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {dashboardItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                                delay: 0.8 + index * 0.15,
                                type: "spring",
                                stiffness: 300,
                                damping: 15
                            }}
                            whileHover={{
                                scale: 1.08,
                                y: -8,
                                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                                transition: { duration: 0.01 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleItemClick(item.action)}
                            className="flex flex-col items-center p-4 rounded-xl bg-background-secondary
                         border border-card-border hover:border-brand-400 cursor-pointer transition-colors group"
                        >
                            <motion.div
                                whileHover={{
                                    rotate: [0, -10, 10, -10, 0],
                                    scale: [1, 1.2, 1.2, 1.2, 1]
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <item.icon className={`w-8 h-8 ${item.color} mb-2 group-hover:drop-shadow-lg transition-all`} />
                            </motion.div>
                            <span className="text-sm font-medium text-center">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
                className="grid grid-cols-3 gap-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                {[
                    { label: "Level", value: "1", icon: "🎮" },
                    { label: "XP", value: "50", icon: "⭐" },
                    { label: "Streak", value: "0", icon: "🔥" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.1 + index * 0.1, type: "spring" }}
                        className="bg-card border border-card-border rounded-xl p-4 text-center"
                    >
                        <span className="text-2xl">{stat.icon}</span>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        <p className="text-xs text-foreground-muted">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
            >
                <Button onClick={onContinue} size="lg" className="w-full">
                    Continue to Platform Overview
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </motion.div>
        </motion.div>
    );
}

export default DashboardPreview;
