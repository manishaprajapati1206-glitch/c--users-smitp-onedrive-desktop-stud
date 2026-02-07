"use client";

import React, { useState, useEffect, useRef, useCallback, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, Clock, BookOpen, BarChart, Star,
    Play, Award, FileText, MessageSquare,
    Upload, Trash2, Download, CheckCircle, AlertCircle, X,
    Brain, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, GlassCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { VideoList } from "@/components/courses/VideoCard";
import { FlashcardGrid } from "@/components/courses/Flashcard";
import { QuizSystem } from "@/components/quiz/QuizSystem";
import { CourseAITutor } from "@/components/ai/MathsAITutor";
import { AIDynamicQuiz } from "@/components/quiz/AIDynamicQuiz";
import { ScrollReveal, DepthLayer } from "@/components/effects/ParallaxContainer";
import { courseService, type Course, type Video, type Flashcard } from "@/services/courses.service";
import { quizService, type Quiz } from "@/services/quiz.service";

interface Assignment {
    id: string;
    course_id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    status: string;
    created_at: string;
    url: string;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(type: string) {
    if (type.startsWith("image/")) return "IMG";
    if (type.includes("pdf")) return "PDF";
    if (type.includes("word") || type.includes("doc")) return "DOC";
    return "FILE";
}

interface CoursePageProps {
    params: Promise<{ courseId: string }>;
}

type TabType = "overview" | "videos" | "flashcards" | "quiz" | "assignments" | "ai-tutor";

export default function CoursePage({ params }: CoursePageProps) {
    const { courseId } = use(params);
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [loading, setLoading] = useState(true);

    // Assignment state
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
    const [isAiQuizOpen, setIsAiQuizOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadAssignments = useCallback(async () => {
        const res = await fetch(`/api/assignments?courseId=${courseId}`);
        if (res.ok) {
            const data = await res.json();
            setAssignments(data.assignments || []);
        }
    }, [courseId]);

    const handleFileUpload = async (file: File) => {
        setUploadError(null);
        setUploadSuccess(null);

        if (file.size > 10 * 1024 * 1024) {
            setUploadError("File too large. Maximum size is 10MB.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        // Simulate progress since fetch doesn't support progress natively
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("courseId", courseId);

        try {
            const res = await fetch("/api/assignments/upload", {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Upload failed");
            }

            setUploadProgress(100);
            setUploadSuccess(`"${file.name}" uploaded successfully!`);
            await loadAssignments();
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 1500);
        }
    };

    const handleDelete = async (assignment: Assignment) => {
        const res = await fetch("/api/assignments", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: assignment.id, filePath: assignment.file_path }),
        });

        if (res.ok) {
            setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
    };

    useEffect(() => {
        const loadCourseData = async () => {
            setLoading(true);
            const courseData = await courseService.getCourseById(courseId);
            if (courseData) {
                setCourse(courseData);
                const courseVideos = await courseService.getCourseVideos(courseId);
                setVideos(courseVideos);

                // Load flashcards from first video
                if (courseVideos.length > 0) {
                    const cards = await courseService.getFlashcards(courseVideos[0].id);
                    setFlashcards(cards);
                }

                // Load quiz
                const quizData = await quizService.getQuizByCourse(courseId);
                setQuiz(quizData || null);
            }
            setLoading(false);
        };

        loadCourseData();
    }, [courseId]);

    useEffect(() => {
        if (activeTab === "assignments") {
            loadAssignments();
        }
    }, [activeTab, loadAssignments]);

    const handleQuizComplete = (score: number, passed: boolean) => {
        console.log(`Quiz completed: ${score} points, passed: ${passed}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
                <Button onClick={() => router.push("/home")}>Go Home</Button>
            </div>
        );
    }

    const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { id: "overview", label: "Overview", icon: BookOpen },
        { id: "videos", label: "Videos", icon: Play },
        { id: "flashcards", label: "Flashcards", icon: FileText },
        { id: "quiz", label: "Quiz", icon: Award },
        { id: "assignments", label: "Assignments", icon: FileText },
        { id: "ai-tutor", label: `${course.category} AI Tutor`, icon: Brain },
    ];

    return (
        <div className="min-h-screen">
            {/* Header with course info */}
            <div className="relative bg-gradient-to-br from-brand-500/20 via-accent-purple/10 to-background py-12 overflow-hidden">
                <DepthLayer depth={0.9} className="absolute inset-0">
                    <div className="absolute top-10 right-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent-purple/10 rounded-full blur-3xl" />
                </DepthLayer>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    {/* Back button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Courses
                    </motion.button>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Course info */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="course">{course.category}</Badge>
                                    <Badge variant="level">{course.difficulty}</Badge>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
                                <p className="text-lg text-foreground-muted mb-6">{course.description}</p>

                                <div className="flex flex-wrap gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-brand-400" />
                                        {course.duration}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-accent-purple" />
                                        {course.totalLectures} lectures
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BarChart className="w-5 h-5 text-accent-green" />
                                        {course.difficulty} level
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Enroll card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassCard className="sticky top-24">
                                {course.enrolled ? (
                                    <>
                                        <div className="text-center mb-4">
                                            <h3 className="font-bold text-lg mb-2">Your Progress</h3>
                                            <ProgressBar progress={course.progress || 0} showLabel />
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={() => setActiveTab("videos")}
                                        >
                                            <Play className="w-5 h-5 mr-2" />
                                            Continue Learning
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center mb-4">
                                            <p className="text-3xl font-bold text-brand-400 mb-2">Free</p>
                                            <p className="text-sm text-foreground-muted">
                                                Start learning today!
                                            </p>
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={() => courseService.enrollInCourse(courseId)}
                                        >
                                            <Star className="w-5 h-5 mr-2" />
                                            Enroll Now
                                        </Button>
                                    </>
                                )}
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-card-border bg-background sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto py-2">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => {
                                    if (tab.id === "ai-tutor") {
                                        setIsAiTutorOpen(true);
                                    } else if (tab.id === "quiz") {
                                        setIsAiQuizOpen(true);
                                    } else {
                                        setActiveTab(tab.id);
                                    }
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                                        ? "bg-brand-500 text-white"
                                        : "text-foreground-muted hover:text-foreground hover:bg-card"
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {tab.id === "ai-tutor" && (
                                    <Sparkles className="w-3 h-3 text-xp-gold" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === "overview" && (
                    <ScrollReveal>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">What you&apos;ll learn</h2>
                                <ul className="space-y-3">
                                    {[
                                        "Master core concepts and fundamentals",
                                        "Apply knowledge to real-world problems",
                                        "Practice with interactive exercises",
                                        "Test your understanding with quizzes",
                                    ].map((item, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-white text-sm">✓</span>
                                            </span>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4">Course Stats</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "Total Duration", value: course.duration, icon: Clock },
                                        { label: "Lectures", value: String(course.totalLectures), icon: BookOpen },
                                        { label: "Difficulty", value: course.difficulty, icon: BarChart },
                                        { label: "Category", value: course.category, icon: Star },
                                    ].map((stat, index) => (
                                        <Card key={index} className="text-center">
                                            <stat.icon className="w-8 h-8 mx-auto mb-2 text-brand-400" />
                                            <p className="font-bold text-lg">{stat.value}</p>
                                            <p className="text-sm text-foreground-muted">{stat.label}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {activeTab === "videos" && (
                    <VideoList videos={videos} title="Course Videos" />
                )}

                {activeTab === "flashcards" && (
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold mb-6">Summary Flashcards</h2>
                        <FlashcardGrid cards={flashcards} />
                    </ScrollReveal>
                )}

                {activeTab === "quiz" && quiz && (
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold mb-6">{quiz.title}</h2>
                        <p className="text-foreground-muted mb-8">
                            Answer {quiz.passingScore} or more questions correctly to pass!
                        </p>
                        <QuizSystem
                            questions={quiz.questions}
                            onComplete={handleQuizComplete}
                            passingScore={quiz.passingScore}
                        />
                    </ScrollReveal>
                )}

                {activeTab === "assignments" && (
                    <ScrollReveal>
                        <Card>
                            <h2 className="text-2xl font-bold mb-4">Upload Assignment</h2>
                            <p className="text-foreground-muted mb-6">
                                Submit your homework for AI-powered review and feedback.
                            </p>

                            {/* Drop zone */}
                            <div
                                onDrop={onDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver
                                    ? "border-brand-500 bg-brand-500/10"
                                    : "border-card-border hover:border-brand-400"
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    onChange={onFileChange}
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`cursor-pointer ${uploading ? "pointer-events-none opacity-50" : ""}`}
                                >
                                    <div className="w-16 h-16 bg-brand-500/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-brand-400" />
                                    </div>
                                    <p className="font-medium mb-2">
                                        {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-sm text-foreground-muted">
                                        PDF, DOC, DOCX, JPG, PNG (max 10MB)
                                    </p>
                                </label>
                            </div>

                            {/* Upload progress */}
                            {uploadProgress > 0 && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-brand-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Status messages */}
                            <AnimatePresence>
                                {uploadError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-4 p-3 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3"
                                    >
                                        <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                                        <p className="text-sm flex-1">{uploadError}</p>
                                        <button onClick={() => setUploadError(null)}>
                                            <X className="w-4 h-4 text-foreground-muted" />
                                        </button>
                                    </motion.div>
                                )}
                                {uploadSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-4 p-3 bg-success/10 border border-success/30 rounded-xl flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                                        <p className="text-sm flex-1">{uploadSuccess}</p>
                                        <button onClick={() => setUploadSuccess(null)}>
                                            <X className="w-4 h-4 text-foreground-muted" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>

                        {/* Uploaded assignments list */}
                        {assignments.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4">
                                    Submitted Assignments ({assignments.length})
                                </h3>
                                <div className="space-y-3">
                                    {assignments.map((assignment, index) => (
                                        <motion.div
                                            key={assignment.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-card-border"
                                        >
                                            {/* File type badge */}
                                            <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-brand-400">
                                                    {getFileIcon(assignment.file_type)}
                                                </span>
                                            </div>

                                            {/* File info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{assignment.file_name}</p>
                                                <p className="text-sm text-foreground-muted">
                                                    {formatFileSize(assignment.file_size)} &middot;{" "}
                                                    {new Date(assignment.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <Badge variant={assignment.status === "reviewed" ? "course" : "level"}>
                                                {assignment.status}
                                            </Badge>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <a
                                                    href={assignment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(assignment)}
                                                    className="p-2 rounded-lg hover:bg-error/10 text-foreground-muted hover:text-error transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {assignments.length === 0 && (
                            <div className="mt-8 text-center text-foreground-muted py-8">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No assignments submitted yet.</p>
                            </div>
                        )}
                    </ScrollReveal>
                )}
            </div>
            {/* Course AI Tutor Popup */}
            <CourseAITutor
                isOpen={isAiTutorOpen}
                onClose={() => setIsAiTutorOpen(false)}
                courseTitle={course.title}
                category={course.category}
            />

            {/* Dynamic AI Quiz Popup */}
            <AIDynamicQuiz
                isOpen={isAiQuizOpen}
                onClose={() => setIsAiQuizOpen(false)}
                courseTitle={course.title}
                videos={videos.map(v => ({ title: v.title, summary: v.summary || "" }))}
            />
        </div>
    );
}
