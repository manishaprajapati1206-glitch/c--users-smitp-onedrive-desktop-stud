"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Filter, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CourseCard } from "@/components/courses/CourseCard";
import { ScrollReveal } from "@/components/effects/ParallaxContainer";
import { courseService, type Course } from "@/services/courses.service";
import { staggerContainer, fadeUpItem } from "@/animations/variants";

const categories = [
    "All",
    "Mathematics",
    "Science",
    "Social Studies",
    "Soft Skills",
    "Computer Science",
];

export default function CoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            const data = await courseService.getAllCourses();
            setCourses(data);
            setLoading(false);
        };
        loadCourses();
    }, []);

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-br from-brand-500/10 via-accent-purple/5 to-background py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.push("/home")}
                        className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                            <BookOpen className="w-10 h-10 text-brand-400" />
                            All Courses
                        </h1>
                        <p className="text-foreground-muted">
                            Explore our complete library of courses
                        </p>
                    </motion.div>

                    {/* Search and filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-6 flex flex-col sm:flex-row gap-4"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-card-border
                         focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Category filters */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 flex flex-wrap gap-2"
                    >
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === category
                                        ? "bg-brand-500 text-white"
                                        : "bg-card border border-card-border hover:border-brand-400"
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Courses grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full"
                        />
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-foreground-muted" />
                        <h2 className="text-xl font-bold mb-2">No courses found</h2>
                        <p className="text-foreground-muted">
                            Try adjusting your search or filters
                        </p>
                    </div>
                ) : (
                    <ScrollReveal>
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredCourses.map((course, index) => (
                                <motion.div key={course.id} variants={fadeUpItem}>
                                    <CourseCard
                                        course={course}
                                        featured={index === 0 && selectedCategory === "All"}
                                        onClick={() => router.push(`/courses/${course.id}`)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </ScrollReveal>
                )}
            </div>
        </div>
    );
}
