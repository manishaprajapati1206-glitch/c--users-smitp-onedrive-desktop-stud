"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCircle, Calendar, Edit2, Trophy, Star, Flame, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ParallaxCard } from "@/components/ui/ParallaxCard";
import { FloatingStationery } from "@/components/effects/FloatingStationery";
import userService, { User } from "@/services/user.service";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userService.getProfile().then((profile) => {
            setUser(profile);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const stats = [
        { label: "Total XP", value: user ? user.xp.toLocaleString() : "0", icon: Star, color: "text-white", gradient: "from-amber-400 to-orange-500" },
        { label: "Day Streak", value: user ? String(user.streak) : "0", icon: Flame, color: "text-white", gradient: "from-orange-500 to-red-600" },
        { label: "Courses", value: user ? String(user.subjects.length) : "0", icon: BookOpen, color: "text-white", gradient: "from-blue-500 to-cyan-400" },
        { label: "Badges", value: user ? String(user.achievements.length) : "0", icon: Trophy, color: "text-white", gradient: "from-purple-500 to-pink-500" },
    ];

    const achievements = user?.achievements.length ? user.achievements.map(a => ({
        name: a.title,
        icon: a.icon,
        desc: a.description,
    })) : [
        { name: "No achievements yet", icon: "🏆", desc: "Keep learning to unlock achievements!" },
    ];

    const activity = [
        { action: "Joined", target: user?.subjects.join(", ") || "courses", time: "Recently" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
        );
    }

    const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || "Student" : "Student";

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-12">
            <FloatingStationery />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                {/* Header Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-card border border-card-border shadow-lg p-8 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-accent-purple/5" />

                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-400 to-accent-purple p-1 shadow-xl">
                                <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                                    <UserCircle className="w-24 h-24 text-foreground-muted/50" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                                <p className="text-foreground-muted mb-4 flex items-center justify-center sm:justify-start gap-4 text-sm">
                                    {user?.standard && <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {user.standard}</span>}
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {user?.email || ""}</span>
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <Badge variant="level">Level {user?.level || 1}</Badge>
                                    {user?.subjects.length ? <Badge variant="pro">{user.subjects.length} Subjects</Badge> : null}
                                </div>
                            </div>

                            <Button onClick={() => router.push('/profile/edit')} className="shadow-lg">
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.1 }}
                            className="h-40"
                        >
                            <ParallaxCard gradient={stat.gradient}>
                                <div className="h-full flex flex-col items-center justify-center p-2 text-white">
                                    <stat.icon className={`w-10 h-10 mb-3 text-white`} />
                                    <span className="text-3xl font-bold mb-1">{stat.value}</span>
                                    <span className="text-sm font-medium opacity-90">{stat.label}</span>
                                </div>
                            </ParallaxCard>
                        </motion.div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Achievements */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-xp-gold" /> Recent Achievements
                        </h2>
                        <div className="space-y-4">
                            {achievements.map((achievement, i) => (
                                <motion.div
                                    key={achievement.name}
                                    whileHover={{ scale: 1.02, x: 5, transition: { duration: 0.2 } }}
                                    className="bg-card border border-card-border p-4 rounded-2xl flex items-center gap-4 shadow-sm"
                                >
                                    <div className="text-3xl">{achievement.icon}</div>
                                    <div>
                                        <h3 className="font-semibold">{achievement.name}</h3>
                                        <p className="text-sm text-foreground-muted">{achievement.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-brand-500" /> Recent Activity
                        </h2>
                        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
                            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-card-border">
                                {activity.map((item, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-brand-500 border-4 border-card" />
                                        <p className="text-sm text-foreground-muted mb-1">{item.time}</p>
                                        <p className="font-medium">
                                            {item.action} <span className="text-brand-500">{item.target}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
