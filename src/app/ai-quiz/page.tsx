"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Brain, Clock, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

interface AIQuizMessage {
    id: string;
    role: "ai" | "user";
    content: string;
    isCorrect?: boolean;
}

const sampleQuestions = [
    "What is the derivative of x³?",
    "Explain the chain rule in calculus.",
    "What is the limit of sin(x)/x as x approaches 0?",
    "How do you integrate e^x?",
    "What is the fundamental theorem of calculus?",
];

export default function AIQuizPage() {
    const [isStarted, setIsStarted] = useState(false);
    const [messages, setMessages] = useState<AIQuizMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [timer, setTimer] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (isStarted && !isComplete) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isStarted, isComplete]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const startQuiz = () => {
        setIsStarted(true);
        setTimer(0);
        setScore(0);
        setCurrentQuestion(0);
        setIsComplete(false);

        // Initial AI message
        const introMessage: AIQuizMessage = {
            id: "intro",
            role: "ai",
            content: "Welcome to the 1-on-1 AI Quiz! 🎓 I'll ask you questions one at a time, and you explain your answer in your own words. I'll evaluate your understanding. Ready? Here's your first question!",
        };

        const firstQuestion: AIQuizMessage = {
            id: "q0",
            role: "ai",
            content: `Question 1: ${sampleQuestions[0]}`,
        };

        setMessages([introMessage, firstQuestion]);
    };

    const submitAnswer = async () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage: AIQuizMessage = {
            id: `user-${currentQuestion}`,
            role: "user",
            content: inputValue,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI evaluation
        setTimeout(() => {
            // Random evaluation (in real app, this would be actual AI)
            const isCorrect = inputValue.length > 20 && Math.random() > 0.3;

            // AI feedback message
            const feedbackMessage: AIQuizMessage = {
                id: `feedback-${currentQuestion}`,
                role: "ai",
                content: isCorrect
                    ? `✅ Excellent explanation! You clearly understand this concept. ${currentQuestion < 4 ? "Let's move to the next question." : ""
                    }`
                    : `❌ Not quite. The correct approach is: ${inputValue.length < 20
                        ? "You need to provide a more detailed explanation."
                        : "Your understanding is close, but let me clarify the key point..."
                    }`,
                isCorrect,
            };

            if (isCorrect) setScore((prev) => prev + 1);

            setMessages((prev) => [...prev, feedbackMessage]);

            // Next question or completion
            if (currentQuestion < sampleQuestions.length - 1) {
                setTimeout(() => {
                    const nextQ = currentQuestion + 1;
                    setCurrentQuestion(nextQ);
                    const nextQuestion: AIQuizMessage = {
                        id: `q${nextQ}`,
                        role: "ai",
                        content: `Question ${nextQ + 1}: ${sampleQuestions[nextQ]}`,
                    };
                    setMessages((prev) => [...prev, nextQuestion]);
                    setIsTyping(false);
                }, 1500);
            } else {
                setTimeout(() => {
                    setIsComplete(true);
                    if (timerRef.current) clearInterval(timerRef.current);

                    const completeMessage: AIQuizMessage = {
                        id: "complete",
                        role: "ai",
                        content: `🎉 Quiz Complete!\n\nYou scored ${score + (isCorrect ? 1 : 0)}/5!\n\nTime taken: ${formatTime(timer)}\n\n${score + (isCorrect ? 1 : 0) >= 4
                            ? "Amazing work! You've demonstrated excellent understanding! 🏆"
                            : score + (isCorrect ? 1 : 0) >= 3
                                ? "Good job! Keep practicing to improve further. 👍"
                                : "You might want to review the material again. Keep learning! 📚"
                            }`,
                    };
                    setMessages((prev) => [...prev, completeMessage]);
                    setIsTyping(false);
                }, 1500);
            }
        }, 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitAnswer();
        }
    };

    return (
        <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-foreground-muted hover:text-foreground mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                    <Brain className="w-8 h-8 text-accent-purple" />
                    1-on-1 AI Quiz
                </h1>
                <p className="text-foreground-muted">
                    Answer questions in your own words. The AI will evaluate your understanding.
                </p>
            </motion.div>

            {!isStarted ? (
                // Start screen
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                >
                    <motion.div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink mx-auto mb-6 flex items-center justify-center"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Bot className="w-12 h-12 text-white" />
                    </motion.div>

                    <h2 className="text-2xl font-bold mb-4">Ready for a Challenge?</h2>
                    <p className="text-foreground-muted mb-8 max-w-md mx-auto">
                        This interactive quiz tests your understanding through conversation.
                        Explain your answers in your own words!
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <Badge variant="info">5 Questions</Badge>
                        <Badge variant="warning">Written Answers</Badge>
                        <Badge variant="success">AI Evaluation</Badge>
                    </div>

                    <Button onClick={startQuiz} size="lg">
                        <Brain className="w-5 h-5 mr-2" />
                        Start Quiz
                    </Button>
                </motion.div>
            ) : (
                // Quiz interface
                <div className="space-y-6">
                    {/* Progress bar */}
                    <Card className="flex items-center justify-between gap-4 py-4">
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Question {Math.min(currentQuestion + 1, 5)} of 5</span>
                                <span>Score: {score}</span>
                            </div>
                            <ProgressBar
                                progress={((currentQuestion + (isComplete ? 1 : 0)) / 5) * 100}
                                color="brand"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-foreground-muted">
                            <Clock className="w-5 h-5" />
                            {formatTime(timer)}
                        </div>
                    </Card>

                    {/* Chat interface */}
                    <Card className="h-[500px] flex flex-col p-0">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex",
                                        message.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {message.role === "ai" && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center mr-2 flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl p-4",
                                            message.role === "user"
                                                ? "bg-brand-500 text-white rounded-br-sm"
                                                : "bg-background-secondary rounded-bl-sm",
                                            message.isCorrect === true && "border-2 border-success",
                                            message.isCorrect === false && "border-2 border-error"
                                        )}
                                    >
                                        <p className="whitespace-pre-line">{message.content}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-background-secondary rounded-2xl rounded-bl-sm p-3">
                                        <motion.div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <motion.span
                                                    key={i}
                                                    className="w-2 h-2 bg-foreground-muted rounded-full"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{
                                                        duration: 0.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.1,
                                                    }}
                                                />
                                            ))}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        {!isComplete && (
                            <div className="p-4 border-t border-card-border">
                                <div className="flex gap-3">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your answer here..."
                                        className="flex-1 bg-background-secondary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 min-h-[60px] resize-none"
                                        disabled={isTyping}
                                    />
                                    <Button
                                        onClick={submitAnswer}
                                        disabled={!inputValue.trim() || isTyping}
                                        className="self-end"
                                    >
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                                <p className="text-xs text-foreground-muted mt-2">
                                    Press Enter to submit, Shift+Enter for new line
                                </p>
                            </div>
                        )}

                        {/* Completion actions */}
                        {isComplete && (
                            <div className="p-4 border-t border-card-border flex gap-4">
                                <Button onClick={startQuiz} variant="outline" className="flex-1">
                                    Try Again
                                </Button>
                                <Button onClick={() => window.history.back()} className="flex-1">
                                    <Trophy className="w-5 h-5 mr-2" />
                                    Done
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}
