"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, Brain, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { QuizSystem } from "@/components/quiz/QuizSystem";
import type { QuizQuestion } from "@/services/quiz.service";

interface AIDynamicQuizProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    videos: { title: string; summary: string }[];
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const MODEL_NAME = "gemini-2.5-flash";

export function AIDynamicQuiz({ isOpen, onClose, courseTitle, videos }: AIDynamicQuizProps) {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

    const generateQuiz = async () => {
        setIsLoading(true);
        setError(null);
        setQuestions([]);
        setFeedback(null);

        const videoContext = videos.map(v => `- ${v.title}: ${v.summary}`).join("\n");

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `You are an expert ${courseTitle} examiner. Generate exactly 15 high-quality multiple-choice questions based on the following course videos:
                                               ${videoContext}
                                               
                                               Each question must have 4 options.
                                               The output MUST be a valid JSON array of objects.
                                               Each object structure MUST be exactly:
                                               {
                                                 "id": "unique_string_id",
                                                 "question": "The question text",
                                                 "options": ["Option A", "Option B", "Option C", "Option D"],
                                                 "correctAnswer": index_of_correct_option_0_to_3
                                               }`,
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            response_mime_type: "application/json",
                            temperature: 0.7,
                        },
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to generate quiz");
            }

            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            try {
                // More robust extraction in case it's wrapped in markdown or has leading/trailing text
                const jsonMatch = rawText.match(/\[[\s\S]*\]/);
                const jsonToParse = jsonMatch ? jsonMatch[0] : rawText;
                const parsedQuestions = JSON.parse(jsonToParse);

                if (Array.isArray(parsedQuestions)) {
                    setQuestions(parsedQuestions);
                } else {
                    throw new Error("Invalid format: expected a JSON array.");
                }
            } catch (parseErr) {
                console.error("JSON Parse Error:", parseErr, "Raw Text:", rawText);
                throw new Error("I received an invalid response format. Please try again.");
            }
        } catch (err) {
            console.error("Quiz Generation Error:", err);
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const generateFeedback = async (score: number, total: number) => {
        setIsGeneratingFeedback(true);
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `The student just completed a quiz on ${courseTitle} (topics: ${videos.map(v => v.title).join(", ")}).
                                       They scored ${score} out of ${total}.
                                       Provide a brief, encouraging feedback message (max 3-4 sentences). 
                                       Include 2 specific bullet points on how they can improve based on this score.
                                       Use bold markdown for emphasis.`
                            }]
                        }]
                    })
                }
            );
            const data = await response.json();
            const feedbackText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Great effort! Keep practicing to master these concepts.";
            setFeedback(feedbackText);
        } catch (err) {
            console.error("Feedback Generation Error:", err);
        } finally {
            setIsGeneratingFeedback(false);
        }
    };

    useEffect(() => {
        if (isOpen && questions.length === 0) {
            generateQuiz();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleComplete = (score: number, passed: boolean) => {
        generateFeedback(score, questions.length);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-3xl h-[700px] flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GlassCard className="flex-1 flex flex-col p-0 border-white/20 bg-card/80">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-brand-500/20 to-accent-purple/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                                        Dynamic AI Quiz
                                        <Sparkles className="w-3.5 h-3.5 text-xp-gold" />
                                    </h3>
                                    <p className="text-xs text-foreground-muted">Personalized for your progress</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center"
                                        >
                                            <Brain className="w-10 h-10 text-brand-400" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 border-b-2 border-brand-500 rounded-full"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold">Generating your personalized quiz...</p>
                                        <p className="text-sm text-foreground-muted">Analyzing video content for high-quality questions</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
                                        <X className="w-8 h-8 text-error" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold">Generation Failed</p>
                                        <p className="text-sm text-foreground-muted mb-4">{error}</p>
                                        <Button onClick={generateQuiz} variant="secondary">
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            ) : questions.length > 0 ? (
                                <QuizSystem
                                    questions={questions}
                                    onComplete={handleComplete}
                                    passingScore={Math.ceil(questions.length * 0.6)}
                                    extraResultsContent={
                                        <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-6 relative overflow-hidden">
                                            <div className="flex items-center gap-2 mb-3 text-brand-400">
                                                <Sparkles className="w-5 h-5" />
                                                <span className="font-bold text-sm uppercase tracking-wider">AI Insight & Suggestions</span>
                                            </div>

                                            {isGeneratingFeedback ? (
                                                <div className="flex items-center gap-3 text-foreground-muted">
                                                    <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                                                    <span className="text-sm">Analyzing results and generating feedback...</span>
                                                </div>
                                            ) : feedback ? (
                                                <div className="prose prose-sm prose-invert max-w-none">
                                                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                                                        {feedback}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-foreground-muted">Great job completing the quiz!</p>
                                            )}

                                            {/* Decorative background flare */}
                                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl" />
                                        </div>
                                    }
                                />
                            ) : null}
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
