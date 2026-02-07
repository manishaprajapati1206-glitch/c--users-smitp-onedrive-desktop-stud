"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Search, Bell, User, Zap, Star, Flame, ChevronRight,
    BookOpen, Trophy, Target, TrendingUp, Clock, Play,
    GraduationCap, Sparkles, ArrowRight, Brain, Users, Bot
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CourseCard } from "@/components/courses/CourseCard";
import { VideoCard } from "@/components/courses/VideoCard";
import { Card } from "@/components/ui/Card";
import { CircularProgress } from "@/components/ui/ProgressBar";
import { FloatingStationery } from "@/components/effects/FloatingStationery";
import { StreakWidget } from "@/components/widgets/StreakWidget";
import { ParallaxCard } from "@/components/ui/ParallaxCard";
import { AIMasterTutor } from "@/components/ai/AIMasterTutor";
import { courseService, type Course, type Video } from "@/services/courses.service";
import { userService, type User as UserProfile } from "@/services/user.service";

export default function HomePage() {
    const router = useRouter();
    const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
    const [suggestedVideos, setSuggestedVideos] = useState<Video[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isMasterTutorOpen, setIsMasterTutorOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const profile = await userService.getProfile();
            if (profile) {
                const newStreak = await userService.updateStreak();
                profile.streak = newStreak;
            }
            setUser(profile);

            const courses = await courseService.getFeaturedCourses();
            setFeaturedCourses(courses);

            const enrolledCourse = courses.find((c) => c.enrolled);
            if (enrolledCourse) {
                const videos = await courseService.getCourseVideos(enrolledCourse.id);
                setSuggestedVideos(videos);
            }
        };
        loadData();
    }, []);

    const handleCourseClick = (courseId: string) => {
        router.push(`/courses/${courseId}`);
    };

    const quickActions = [
        { icon: Brain, label: "AI Quiz", color: "from-sky-500 to-blue-600", route: "/ai-quiz" },
        { icon: BookOpen, label: "My Courses", color: "from-violet-500 to-fuchsia-500", route: "/courses" },
        { icon: Trophy, label: "Leaderboard", color: "from-amber-400 to-orange-500", route: "/leaderboard" },
    ];

    const stats = [
        { icon: Target, label: "Goals Met", value: "12", subtext: "This Week" },
        { icon: Clock, label: "Study Time", value: "24h", subtext: "This Month" },
        { icon: TrendingUp, label: "Rank", value: "#42", subtext: "Top 5%" },
    ];

    const enrolledCourses = featuredCourses.filter((c) => c.enrolled);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Floating Stationery Background */}
            <FloatingStationery />

            {/* Gaussian Blur Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 -left-32 w-80 h-80 bg-accent-purple/15 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -40, 0],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent-pink/15 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-1/3 w-56 h-56 bg-xp-gold/10 rounded-full blur-3xl"
                />
            </div>

            {/* Floating Header */}
            <header className="sticky top-0 z-50">
                <div className="mx-4 mt-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto bg-card/90 backdrop-blur-xl rounded-2xl border border-card-border shadow-lg"
                    >
                        <div className="px-6 py-4 flex items-center justify-between gap-6">
                            {/* Logo */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => router.push('/home')}
                                className="flex items-center gap-3 cursor-pointer"
                            >
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-purple flex items-center justify-center shadow-lg shadow-brand-500/30">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text">SocraticAI</span>
                                    <p className="text-xs text-foreground-muted -mt-0.5">Learn Smarter</p>
                                </div>
                            </motion.div>

                            {/* Search - Expandable */}
                            <motion.div
                                animate={{ flex: searchFocused ? 2 : 1 }}
                                className="flex-1 max-w-xl"
                            >
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted group-focus-within:text-brand-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search courses, topics, or instructors..."
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-background-secondary border border-transparent
                                            focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 
                                            focus:bg-background transition-all placeholder:text-foreground-muted/60"
                                    />
                                </div>
                            </motion.div>

                            {/* Right Controls */}
                            <div className="flex items-center gap-2">
                                <ThemeToggle />

                                {/* Notifications */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                                    className="relative p-3 rounded-xl hover:bg-background-secondary transition-colors"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-card" />
                                </motion.button>

                                {/* Profile */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                                    className="relative"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center ring-2 ring-card shadow-lg">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-green rounded-full ring-2 ring-card" />
                                </motion.button>

                                {/* Dropdowns */}
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-20 right-20 w-96 bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden z-50"
                                        >
                                            <div className="p-4 border-b border-card-border bg-gradient-to-r from-brand-500/10 to-accent-purple/10">
                                                <h3 className="font-bold text-lg">Notifications</h3>
                                                <p className="text-xs text-foreground-muted">You have 2 new updates</p>
                                            </div>
                                            <div className="p-2 max-h-80 overflow-y-auto">
                                                {[
                                                    { emoji: "🎉", title: "Welcome to SocraticAI!", desc: "Start your learning journey today", time: "Just now" },
                                                    { emoji: "📚", title: "New course available", desc: "Check out Science Fundamentals", time: "2h ago" },
                                                    { emoji: "🏆", title: "Achievement unlocked!", desc: "You completed 5 quizzes", time: "1d ago" },
                                                ].map((n, i) => (
                                                    <motion.div
                                                        key={i}
                                                        whileHover={{ backgroundColor: "var(--background-secondary)" }}
                                                        className="flex items-start gap-3 p-3 rounded-xl cursor-pointer"
                                                    >
                                                        <span className="text-2xl">{n.emoji}</span>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{n.title}</p>
                                                            <p className="text-xs text-foreground-muted">{n.desc}</p>
                                                        </div>
                                                        <span className="text-xs text-foreground-muted">{n.time}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {showProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-20 right-4 w-72 bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden z-50"
                                        >
                                            <div className="p-4 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-lg">
                                                        <User className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{user ? `${user.firstName} ${user.lastName}`.trim() || "Student" : "Student"}</p>
                                                        <p className="text-xs text-foreground-muted">{user?.email || ""}</p>
                                                        <Badge variant="level" className="mt-1 text-xs">Level {user?.level ?? 1}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                {[
                                                    { label: "My Profile", route: "/profile" },
                                                    { label: "Settings", route: "/settings" },
                                                    { label: "Help Center", route: "/help-center" },
                                                ].map((item) => (
                                                    <button
                                                        key={item.label}
                                                        onClick={() => router.push(item.route)}
                                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-background-secondary text-sm font-medium transition-colors flex items-center justify-between"
                                                    >
                                                        {item.label}
                                                        <ChevronRight className="w-4 h-4 text-foreground-muted" />
                                                    </button>
                                                ))}
                                                <hr className="my-2 border-card-border" />
                                                <button
                                                    onClick={async () => { await userService.signOut(); router.push("/onboarding"); }}
                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-error/10 text-sm font-medium text-error transition-colors"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">

                {/* Hero Section - Welcome + Stats */}
                <section className="mb-10">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Welcome Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2"
                        >
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-purple p-8 text-white">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <Badge variant="level" className="bg-white/20 text-white border-white/30">
                                            <Flame className="w-3.5 h-3.5" /> {user?.streak ?? 0} Day Streak
                                        </Badge>
                                        <Badge variant="xp" className="bg-white/20 text-white border-white/30">
                                            <Star className="w-3.5 h-3.5" /> {user?.xp?.toLocaleString() ?? 0} XP
                                        </Badge>
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                                        Welcome back, {user?.firstName || "Student"}! 👋
                                    </h1>
                                    <p className="text-white/80 text-lg mb-6 max-w-lg">
                                        Ready to continue your learning journey? Pick up where you left off or explore something new.
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            className="bg-white text-brand-600 hover:bg-white/90 shadow-xl"
                                            onClick={() => router.push('/ai-quiz')}
                                        >
                                            <Brain className="w-5 h-5 mr-2" />
                                            Start AI Quiz
                                        </Button>
                                        <Button
                                            className="bg-gradient-to-r from-accent-purple to-accent-pink text-white hover:opacity-90 shadow-lg border-none"
                                            onClick={() => setIsMasterTutorOpen(true)}
                                        >
                                            <Bot className="w-5 h-5 mr-2" />
                                            1-to-1 AI Master Tutor
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-white/40 text-white hover:bg-white/10"
                                            onClick={() => router.push('/courses')}
                                        >
                                            Browse Courses
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Streak Widget */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="h-full"
                        >
                            <StreakWidget streakDays={user?.streak ?? 0} className="h-full" />
                        </motion.div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mb-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    >
                        {quickActions.map((action, i) => (
                            <div key={action.label} className="h-40">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    className="h-full w-full"
                                >
                                    <ParallaxCard
                                        gradient={action.color}
                                        onClick={() => router.push(action.route)}
                                    >
                                        <div className="flex flex-col h-full justify-center items-center text-center">
                                            <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                <action.icon className="w-8 h-8 text-white drop-shadow-md" />
                                            </div>
                                            <p className="font-bold text-lg tracking-wide drop-shadow-sm">{action.label}</p>
                                        </div>
                                    </ParallaxCard>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* Continue Learning */}
                {enrolledCourses.length > 0 && (
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Play className="w-6 h-6 text-brand-500" />
                                Continue Learning
                            </h2>
                            <Button variant="ghost" onClick={() => router.push("/courses")}>
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {enrolledCourses.map((course, i) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => handleCourseClick(course.id)}
                                    className="cursor-pointer"
                                >
                                    <Card className="p-5 hover:border-brand-400 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-purple/20 flex items-center justify-center flex-shrink-0">
                                                <GraduationCap className="w-8 h-8 text-brand-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg truncate">{course.title}</h3>
                                                <p className="text-sm text-foreground-muted">{course.totalLectures} lectures • {course.duration}</p>
                                                <div className="mt-2 flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-background-secondary rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${course.progress}%` }}
                                                            transition={{ delay: 0.6, duration: 0.8 }}
                                                            className="h-full bg-gradient-to-r from-brand-500 to-accent-purple rounded-full"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-brand-500">{course.progress}%</span>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-foreground-muted" />
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Featured Courses */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-xp-gold" />
                            Featured Courses
                        </h2>
                        <Button variant="ghost" onClick={() => router.push("/courses")}>
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {featuredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <CourseCard
                                    course={course}
                                    featured={index === 0}
                                    onClick={() => handleCourseClick(course.id)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Suggested Videos */}
                {suggestedVideos.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Play className="w-6 h-6 text-accent-purple" />
                                Continue Watching
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suggestedVideos.map((video, i) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                >
                                    <VideoCard video={video} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* AI Master Tutor Modal */}
            <AIMasterTutor
                isOpen={isMasterTutorOpen}
                onClose={() => setIsMasterTutorOpen(false)}
                userParams={{
                    name: user?.firstName || "Student",
                    level: user?.level || 1
                }}
            />
        </div>
    );
}
