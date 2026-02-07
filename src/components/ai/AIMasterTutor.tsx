"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Send, Volume2, VolumeX, Bot, Sparkles, StopCircle, Play, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Ensure CSS is imported
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";

interface AIMasterTutorProps {
    isOpen: boolean;
    onClose: () => void;
    userParams?: {
        name: string;
        level: number;
    };
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const MODEL_NAME = "gemini-2.5-flash";

export function AIMasterTutor({ isOpen, onClose, userParams }: AIMasterTutorProps) {
    const [messages, setMessages] = useState<{ role: "user" | "model"; text: string; image?: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Initial greeting
            const greeting = `Hello ${userParams?.name || "Student"}! I am your AI Master Tutor. I can explain complex topics, solve problems, or just chat about your studies. How can I help you today?`;
            setMessages([{ role: "model", text: greeting }]);
            speak(greeting);
        } else if (!isOpen) {
            stopSpeaking();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const speak = (text: string) => {
        if (!synthRef.current || isMuted) return;

        // Cancel existing speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        // Try to select a good voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft Zira") || v.lang === "en-US");
        if (preferredVoice) utterance.voice = preferredVoice;

        synthRef.current.speak(utterance);
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            setIsMuted(false);
        } else {
            stopSpeaking();
            setIsMuted(true);
        }
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

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage = input.trim();
        const userImage = selectedImage;

        setInput("");
        setSelectedImage(null);
        setMessages(prev => [...prev, { role: "user", text: userMessage, image: userImage || undefined }]);
        setIsLoading(true);

        try {
            const parts: any[] = [];

            if (userMessage) {
                parts.push({
                    text: `You are an AI Master Tutor. Your name is SocraticAI.
                           User Name: ${userParams?.name || "Student"}
                           
                           Your goal is to be a helpful, encouraging, and highly knowledgeable tutor.
                           Keep your answers concise (max 3-4 sentences) and conversational, as they will be spoken aloud to the user.
                           Avoid using markdown formatting like bold or lists if possible, as it doesn't translate well to text-to-speech.
                           If a user uploads an image, analyze it and solve the problem or explain the concept shown.
                           
                           User Query: ${userMessage}`
                });
            }

            if (userImage) {
                // Extract base64 part
                const base64Data = userImage.split(",")[1];
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg", // Assuming jpeg/png, Gemini handles most
                        data: base64Data
                    }
                });
            }

            // If only image, add a prompt
            if (!userMessage && userImage) {
                parts.push({
                    text: `Analyze this image and explain what you see or solve the problem shown. Keep it concise.`
                });
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts }]
                    })
                }
            );

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I'm having trouble connecting to my brain right now.";

            setMessages(prev => [...prev, { role: "model", text: aiText }]);
            speak(aiText);

        } catch (error) {
            console.error("AI Tutor Error:", error);
            const errorMsg = "I seem to be having technical difficulties. Please try again later.";
            setMessages(prev => [...prev, { role: "model", text: errorMsg }]);
            speak(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

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
                    className="w-full max-w-2xl h-[600px] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GlassCard className="flex-1 flex flex-col p-0 border-white/20 bg-card/95 relative overflow-hidden">

                        {/* Audio Visualization / Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-brand-600/30 to-accent-purple/30 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isSpeaking ? "bg-brand-500 scale-110 shadow-brand-500/50" : "bg-brand-600/80"}`}>
                                    {isSpeaking ? (
                                        <div className="flex gap-1 items-end h-6">
                                            {[1, 2, 3, 4].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: ["20%", "100%", "20%"] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                                                    className="w-1.5 bg-white rounded-full"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <Bot className="w-7 h-7 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                                        AI Master Tutor
                                        <Sparkles className="w-3.5 h-3.5 text-xp-gold" />
                                    </h3>
                                    <p className="text-xs text-foreground-muted flex items-center gap-1">
                                        {isSpeaking ? "Speaking..." : "Listening"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleMute}
                                    className={`p-2 rounded-full transition-colors ${isMuted ? "text-error hover:bg-error/10" : "text-brand-400 hover:bg-brand-400/10"}`}
                                >
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Background Effect */}
                        <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 scrollbar-thin">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user"
                                            ? "bg-brand-500 text-white rounded-tr-none"
                                            : "bg-white/10 backdrop-blur-md border border-white/10 rounded-tl-none"
                                            }`}
                                    >
                                        {msg.image && (
                                            <img src={msg.image} alt="User upload" className="w-full max-w-xs rounded-lg mb-2 border border-white/20" />
                                        )}
                                        <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    strong: ({ children }) => <strong className="text-brand-300 font-semibold">{children}</strong>,
                                                    a: ({ href, children }) => <a href={href} className="text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-card/95 z-10 flex flex-col gap-2">
                            {selectedImage && (
                                <div className="flex items-center gap-2 px-2">
                                    <div className="relative group">
                                        <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-brand-500/50" />
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full hover:bg-error/80 transition-colors shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <span className="text-xs text-foreground-muted">Image selected</span>
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
                                    className="text-foreground-muted hover:text-brand-400 hover:bg-white/5 px-2"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                </Button>

                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={selectedImage ? "Ask about this image..." : "Ask anything..."}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all placeholder:text-foreground-muted/50"
                                    autoFocus
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={(!input.trim() && !selectedImage) || isLoading}
                                    className="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>

                    </GlassCard>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
