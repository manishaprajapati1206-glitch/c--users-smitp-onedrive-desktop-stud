"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface AuthFormProps {
    onComplete: (data: { email: string; password: string; isSignUp: boolean }) => void;
    onGoogleSignIn?: () => void;
    isLoading?: boolean;
    serverError?: string;
}

export function AuthForm({ onComplete, onGoogleSignIn, isLoading, serverError }: AuthFormProps) {
    const [isSignUp, setIsSignUp] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (isSignUp && password !== confirmPassword) {
            newErrors.confirm = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onComplete({ email, password, isSignUp });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md mx-auto"
        >
            {/* Logo/Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-purple mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 via-accent-purple to-accent-pink bg-clip-text text-transparent">
                    SocraticAI
                </h1>
                <p className="text-foreground-muted mt-2">
                    {isSignUp ? "Start your learning adventure!" : "Welcome back, explorer!"}
                </p>
            </motion.div>

            {/* Toggle Sign In / Sign Up */}
            <div className="flex bg-card rounded-xl p-1 mb-6 border border-card-border">
                {["Sign Up", "Sign In"].map((label, index) => {
                    const isActive = isSignUp === (index === 0);
                    return (
                        <button
                            key={label}
                            onClick={() => setIsSignUp(index === 0)}
                            className={cn(
                                "flex-1 py-3 rounded-lg font-medium transition-all duration-300",
                                isActive
                                    ? "bg-brand-500 text-white shadow-lg"
                                    : "text-foreground-muted hover:text-foreground"
                            )}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    label="Email"
                    icon={<Mail className="w-5 h-5" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                />

                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        label="Password"
                        icon={<Lock className="w-5 h-5" />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[38px] text-foreground-muted hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <AnimatePresence>
                    {isSignUp && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                label="Confirm Password"
                                icon={<Lock className="w-5 h-5" />}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={errors.confirm}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {serverError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                        {serverError}
                    </motion.div>
                )}

                <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {isSignUp ? "Creating Account..." : "Signing In..."}
                        </span>
                    ) : (
                        <>
                            {isSignUp ? "Create Account" : "Sign In"}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-card-border" />
                <span className="text-sm text-foreground-muted">or continue with</span>
                <div className="flex-1 h-px bg-card-border" />
            </div>

            {/* Social Login */}
            <Button variant="outline" className="w-full" size="lg" onClick={onGoogleSignIn}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </Button>
        </motion.div>
    );
}

export default AuthForm;
