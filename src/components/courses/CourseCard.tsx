"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card3D } from "@/components/effects/ParallaxContainer";
import type { Course } from "@/services/courses.service";

interface CourseCardProps {
    course: Course;
    onClick?: () => void;
    featured?: boolean;
}

export function CourseCard({ course, onClick, featured = false }: CourseCardProps) {
    const difficultyColors = {
        beginner: "bg-accent-green",
        intermediate: "bg-accent-yellow",
        advanced: "bg-accent-orange",
    };

    return (
        <Card3D maxRotation={8}>
            <motion.div
                onClick={onClick}
                className="cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Card className="h-full overflow-hidden hover:border-brand-400 transition-colors">
                    {/* Thumbnail */}
                    <div className="relative h-40 bg-gradient-to-br from-brand-500/20 to-accent-purple/20 -mx-6 -mt-6 mb-4 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-brand-400/50" />
                        </div>

                        {/* Featured badge */}
                        {featured && (
                            <motion.div
                                initial={{ x: -100 }}
                                animate={{ x: 0 }}
                                className="absolute top-3 left-0 bg-gradient-to-r from-xp-gold to-yellow-500 px-4 py-1 text-sm font-bold text-white"
                                style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)" }}
                            >
                                ⭐ Featured
                            </motion.div>
                        )}

                        {/* Difficulty badge */}
                        <div className="absolute top-3 right-3">
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium text-white ${difficultyColors[course.difficulty]
                                    }`}
                            >
                                {course.difficulty}
                            </span>
                        </div>

                        {/* Hover overlay */}
                        <motion.div
                            className="absolute inset-0 bg-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={false}
                        />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-lg mb-2 group-hover:text-brand-400 transition-colors">
                        {course.title}
                    </h3>

                    <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                        {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-foreground-muted mb-4">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.totalLectures} lectures
                        </div>
                    </div>

                    {/* Progress (if enrolled) */}
                    {course.enrolled && course.progress !== undefined && (
                        <div className="mt-auto">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1 text-sm">
                                    <TrendingUp className="w-4 h-4 text-brand-400" />
                                    <span>Progress</span>
                                </div>
                                <span className="text-sm font-bold text-brand-400">{course.progress}%</span>
                            </div>
                            <ProgressBar progress={course.progress} size="sm" color="brand" />
                        </div>
                    )}

                    {/* Enroll CTA (if not enrolled) */}
                    {!course.enrolled && (
                        <motion.div
                            className="mt-auto pt-4 border-t border-card-border"
                            whileHover={{ x: 4 }}
                        >
                            <span className="text-sm font-medium text-brand-400 group-hover:underline">
                                Start Learning →
                            </span>
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </Card3D>
    );
}

export default CourseCard;
