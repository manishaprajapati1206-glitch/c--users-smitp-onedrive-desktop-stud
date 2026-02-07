"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle, X, Send, Bot, Sparkles, Minimize2, Maximize2, Image as ImageIcon
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
    image?: string;
}

const greetings = [
    "Hello! I'm your Study Platform assistant. How can I help you navigate the site today? 🌐",
    "Hi there! Need help finding a course or checking your progress? I'm here to help! 🎓",
    "Welcome back! I can help you with website navigation or general support. What's on your mind? 💬",
    "Hey! Looking for something specific on the platform? Just ask! 🚀",
];

const randomResponses = [
    "That's a great question! Let me think...",
    "Interesting! Here's what I know about that...",
    "Good thinking! The answer is...",
    "Let me help you with that! So basically...",
];

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const MODEL_NAME = "gemini-2.5-flash";

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Random popup appearance
    useEffect(() => {
        const showRandomPopup = () => {
            if (!isOpen && Math.random() > 0.7) {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 5000);
            }
        };

        const interval = setInterval(showRandomPopup, 30000); // Every 30 seconds
        const initialTimeout = setTimeout(showRandomPopup, 5000); // Initial after 5s

        return () => {
            clearInterval(interval);
            clearTimeout(initialTimeout);
        };
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const openChat = () => {
        setIsOpen(true);
        setShowPopup(false);
        if (messages.length === 0) {
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            setMessages([
                {
                    id: "1",
                    role: "ai",
                    content: greeting,
                    timestamp: new Date(),
                },
            ]);
        }
    };

    const closeChat = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

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

    const sendMessage = async () => {
        if ((!inputValue.trim() && !selectedImage) || isTyping) return;

        const userText = inputValue.trim();
        const userImage = selectedImage;
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userText,
            image: userImage || undefined,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setSelectedImage(null);
        setIsTyping(true);

        try {
            const parts: any[] = [];

            if (userText) {
                parts.push({
                    text: `You are the official AI Support Assistant for the Study Platform. Your primary role is to provide customer support and help users navigate the website.
                           
                           Website Structure & Navigation:
                           - Home Page (/home): Overview of student progress, "Continue Watching" section, and daily statistics.
                           - Courses Page (/courses): Explore and enroll in various subjects.
                           - Course Details (/courses/[id]): Access specific lectures, flashcards, quizzes, and assignments.
                           - Profile (/profile): Manage settings and view achievements.
                           
                           Instructions:
                           1. Be helpful, professional, and friendly.
                           2. If a user asks for study help (e.g., "explain math" or "how to solve this"), politely explain that your role is support/navigation, and they should use the subject-specific "AI Tutor" tab inside their course for study assistance.
                           3. Help users find where things are on the site.
                           4. If user uploads an image, analyze it to help with their support query (e.g. error message screenshots).
                           
                           Student Query: ${userText}`
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

            if (!userText && userImage) {
                parts.push({
                    text: `Analyze this image and explain how you can help or where this is on the site.`
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
                throw new Error(data.error?.message || "API Error");
            }

            const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now. Please try again later.";

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: aiResponseText,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Support Bot Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "⚠️ I encountered an error while processing your request. Please check your connection or try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating button */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 1 }}
            >
                {/* Random popup bubble */}
                <AnimatePresence>
                    {showPopup && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            className="absolute bottom-16 right-0 bg-card border border-card-border rounded-xl p-4 shadow-xl min-w-[200px]"
                        >
                            <button
                                onClick={() => setShowPopup(false)}
                                className="absolute top-2 right-2 text-foreground-muted hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <p className="text-sm pr-4">
                                👋 I'm here if you need help!
                            </p>
                            <button
                                onClick={openChat}
                                className="text-brand-400 text-sm font-medium mt-2 hover:underline"
                            >
                                Ask me anything →
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main button */}
                <motion.button
                    onClick={openChat}
                    className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center shadow-xl",
                        "bg-gradient-to-br from-brand-500 to-accent-purple text-white",
                        isOpen && "hidden"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={showPopup ? { scale: [1, 1.1, 1] } : {}}
                    transition={showPopup ? { duration: 0.5, repeat: Infinity } : {}}
                >
                    <MessageCircle className="w-6 h-6" />
                </motion.button>
            </motion.div>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? 60 : 500,
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-card border border-card-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-brand-500 to-accent-purple p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">AI Support Assistant</h3>
                                    <p className="text-xs text-white/70">
                                        {isTyping ? "Typing..." : "Online"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    {isMinimized ? (
                                        <Maximize2 className="w-5 h-5" />
                                    ) : (
                                        <Minimize2 className="w-5 h-5" />
                                    )}
                                </button>
                                <button
                                    onClick={closeChat}
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        {!isMinimized && (
                            <>
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
                                            <div
                                                className={cn(
                                                    "max-w-[80%] rounded-2xl p-3",
                                                    message.role === "user"
                                                        ? "bg-brand-500 text-white rounded-br-sm"
                                                        : "bg-background-secondary rounded-bl-sm"
                                                )}
                                            >
                                                {message.image && (
                                                    <img src={message.image} alt="Upload" className="w-full max-w-[200px] rounded-lg mb-2 border border-white/20" />
                                                )}
                                                {message.role === "ai" && (
                                                    <Sparkles className="w-4 h-4 inline mr-1 text-brand-400" />
                                                )}
                                                <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkMath]}
                                                        rehypePlugins={[rehypeKatex]}
                                                        components={{
                                                            p: ({ children }) => <span className="block mb-2 last:mb-0">{children}</span>,
                                                            strong: ({ children }) => <strong className="text-brand-300 font-semibold">{children}</strong>,
                                                            a: ({ href, children }) => <a href={href} className="text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
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
                                <div className="p-4 border-t border-card-border flex flex-col gap-2">
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

                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleImageSelect}
                                        />
                                        <Button
                                            onClick={() => fileInputRef.current?.click()}
                                            variant="ghost"
                                            className="text-foreground-muted hover:text-brand-400 px-2"
                                        >
                                            <ImageIcon className="w-5 h-5" />
                                        </Button>

                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={selectedImage ? "Ask about this image..." : "How can I help you?"}
                                            className="flex-1 bg-background-secondary rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
                                        />
                                        <Button
                                            onClick={sendMessage}
                                            disabled={(!inputValue.trim() && !selectedImage)}
                                            className="px-3"
                                        >
                                            <Send className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default AIChatbot;
