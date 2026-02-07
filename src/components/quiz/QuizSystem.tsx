"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, PartyPopper, Heart, RefreshCw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/services/quiz.service";

interface QuizSystemProps {
    questions: QuizQuestion[];
    onComplete: (score: number, passed: boolean) => void;
    passingScore?: number;
    extraResultsContent?: React.ReactNode;
}

export function QuizSystem({ questions, onComplete, passingScore = 6, extraResultsContent }: QuizSystemProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showHeartBreak, setShowHeartBreak] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [shakeScreen, setShakeScreen] = useState(false);

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswer = (answerIndex: number) => {
        if (isAnswered) return;

        setSelectedAnswer(answerIndex);
        setIsAnswered(true);

        const isCorrect = answerIndex === question.correctAnswer;

        if (isCorrect) {
            setScore((prev) => prev + 1);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 1500);
        } else {
            setWrongAnswers((prev) => prev + 1);
            setShowHeartBreak(true);
            setShakeScreen(true);
            setTimeout(() => setShakeScreen(false), 500);
            setTimeout(() => setShowHeartBreak(false), 1500);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setIsComplete(true);
            onComplete(score, score >= passingScore);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setScore(0);
        setWrongAnswers(0);
        setIsComplete(false);
    };

    // Show retry/skip options if more than 4 wrong
    const showRetryOptions = wrongAnswers > 4 && !isComplete;

    if (isComplete) {
        const passed = score >= passingScore;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <motion.div
                    animate={passed ? { scale: [1, 1.2, 1] } : { x: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center",
                        passed ? "bg-success" : "bg-error"
                    )}
                >
                    {passed ? (
                        <PartyPopper className="w-12 h-12 text-white" />
                    ) : (
                        <X className="w-12 h-12 text-white" />
                    )}
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">
                    {passed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
                </h2>
                <p className="text-foreground-muted mb-6">
                    You scored {score} out of {questions.length}
                </p>

                {extraResultsContent && (
                    <div className="mb-8 text-left">
                        {extraResultsContent}
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    <Button onClick={restartQuiz} variant="outline">
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Try Again
                    </Button>
                    {!passed && (
                        <Button onClick={() => window.history.back()}>
                            Watch Videos Again
                        </Button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={cn("relative", shakeScreen && "animate-shake")}
        >
            {/* Celebration overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.5, 1] }}
                            className="text-8xl"
                        >
                            🎉
                        </motion.div>
                        {/* Confetti effect */}
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: ["#0ea5e9", "#a855f7", "#ec4899", "#22c55e", "#f59e0b"][i % 5],
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                initial={{ scale: 0, y: 0 }}
                                animate={{
                                    scale: [0, 1, 0],
                                    y: [0, Math.random() * 200 - 100],
                                    x: [0, Math.random() * 200 - 100],
                                }}
                                transition={{ duration: 1 }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Heartbreak overlay */}
            <AnimatePresence>
                {showHeartBreak && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-error/10"
                    >
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.2, 0.8, 1] }}
                            className="relative"
                        >
                            <Heart className="w-24 h-24 text-error fill-error" />
                            <motion.div
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: [0, 1, 0], x: [0, 20, 40] }}
                                className="absolute top-0 right-0"
                            >
                                <Heart className="w-12 h-12 text-error fill-error" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-foreground-muted">
                        Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium">
                        Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}
                    </span>
                </div>
                <ProgressBar progress={progress} color="brand" />
            </div>

            {/* Retry options */}
            {showRetryOptions && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-xl"
                >
                    <p className="text-sm text-center mb-3">
                        You have more than 4 wrong answers. Would you like to:
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Watch Videos Again
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setWrongAnswers(0)}>
                            <SkipForward className="w-4 h-4 mr-2" />
                            Continue Quiz
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Question */}
            <Card className="mb-6">
                <h3 className="text-xl font-bold mb-4">{question.question}</h3>

                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === question.correctAnswer;
                        const showResult = isAnswered;

                        return (
                            <motion.button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={isAnswered}
                                className={cn(
                                    "w-full p-4 rounded-xl text-left transition-all border-2",
                                    !showResult && "border-card-border hover:border-brand-400 bg-card",
                                    showResult && isCorrect && "border-success bg-success/10",
                                    showResult && isSelected && !isCorrect && "border-error bg-error/10",
                                    showResult && !isSelected && !isCorrect && "border-card-border opacity-50"
                                )}
                                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                                            !showResult && "bg-card-border",
                                            showResult && isCorrect && "bg-success text-white",
                                            showResult && isSelected && !isCorrect && "bg-error text-white"
                                        )}
                                    >
                                        {showResult && isCorrect ? (
                                            <Check className="w-5 h-5" />
                                        ) : showResult && isSelected && !isCorrect ? (
                                            <X className="w-5 h-5" />
                                        ) : (
                                            String.fromCharCode(65 + index)
                                        )}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </Card>

            {/* Next button */}
            {isAnswered && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button onClick={nextQuestion} className="w-full" size="lg">
                        {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}

export default QuizSystem;
