"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, User, Loader2, Sparkles, Brain, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";

interface Message {
    role: "user" | "bot";
    content: string;
    image?: string;
}

interface CourseAITutorProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    category: string;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-flash";

export function CourseAITutor({ isOpen, onClose, courseTitle, category }: CourseAITutorProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            content: `Hello! I'm your **${courseTitle}** AI Tutor. How can I help you today?`,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage = input.trim();
        const userImage = selectedImage;

        setInput("");
        setSelectedImage(null);
        setMessages((prev) => [...prev, { role: "user", content: userMessage, image: userImage || undefined }]);
        setIsLoading(true);

        try {
            const parts: any[] = [];

            if (userMessage) {
                parts.push({
                    text: `You are a helpful, expert ${category} tutor specializing in ${courseTitle}. 
                           Help the student with their query: ${userMessage}. 
                           Keep your answer clear, concise, and encourage the student. 
                           Use markdown for formatting if needed.
                           If an image is provided, analyze it to solve the problem or explain the concept.`,
                });
            }

            if (userImage) {
                const base64Data = userImage.split(",")[1];
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data
                    }
                });
            }

            if (!userMessage && userImage) {
                parts.push({
                    text: `Analyze this image and explain what is shown or solve the problem.`
                });
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{ parts }],
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error?.message || "Unknown API error";
                setMessages((prev) => [...prev, { role: "bot", content: `⚠️ Error: ${errorMessage}` }]);
                return;
            }

            if (data.candidates && data.candidates.length > 0) {
                const botResponse = data.candidates[0].content?.parts?.[0]?.text || "No response content.";
                setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
            } else {
                const blockReason = data.promptFeedback?.blockReason || "Request was blocked (possibly safety filters).";
                setMessages((prev) => [...prev, { role: "bot", content: `🚫 Response unreachable: ${blockReason}` }]);
            }
        } catch (error) {
            console.error("Gemini API Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "Oops! Something went wrong. Check your connection and try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                    className="w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
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
                                        {category} AI Tutor
                                        <Sparkles className="w-3.5 h-3.5 text-xp-gold" />
                                    </h3>
                                    <p className="text-xs text-foreground-muted">Powered by Gemini AI</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-accent-purple/20" : "bg-brand-500/20"
                                            }`}>
                                            {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-brand-400" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-brand-500 text-white rounded-tr-none"
                                            : "bg-background-secondary border border-white/5 rounded-tl-none"
                                            }`}>
                                            {msg.image && (
                                                <img src={msg.image} alt="Upload" className="w-full max-w-[200px] rounded-lg mb-2 border border-white/20" />
                                            )}
                                            <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkMath]}
                                                    rehypePlugins={[rehypeKatex]}
                                                    components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        strong: ({ children }) => <strong className="text-brand-300 font-semibold">{children}</strong>,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[85%]">
                                        <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-brand-400" />
                                        </div>
                                        <div className="p-3 bg-background-secondary border border-white/5 rounded-2xl rounded-tl-none">
                                            <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-background-secondary/50 flex flex-col gap-2">
                            {selectedImage && (
                                <div className="flex items-center gap-2 px-2">
                                    <div className="relative group">
                                        <img src={selectedImage} alt="Preview" className="h-12 w-12 object-cover rounded-md border border-brand-500/50" />
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 p-0.5 bg-error text-white rounded-full hover:bg-error/80 transition-colors shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <span className="text-xs text-foreground-muted">Image attached</span>
                                </div>
                            )}

                            <div className="relative flex gap-2 items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageSelect}
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-12 w-12 p-0 rounded-xl bg-white/5 hover:bg-white/10 text-foreground-muted"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                </Button>

                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={selectedImage ? "Ask about this image..." : `Ask a ${category.toLowerCase()} question...`}
                                    className="flex-1 bg-background h-12 px-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/50 transition-all text-sm"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || (!input.trim() && !selectedImage)}
                                    className="h-12 w-12 p-0 rounded-xl bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/20"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-foreground-muted mt-3">
                                Gemini may provide inaccurate info. Double-check important facts.
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
