"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Target, ArrowRight, ArrowLeft, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextArea, Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { availableSubjects, availableStandards } from "@/services/user.service";

interface StudentInfoFormProps {
    onComplete: (data: { standard: string; subjects: string[]; goals: string; comfortableTime: string }) => void;
    onBack: () => void;
}

export function StudentInfoForm({ onComplete, onBack }: StudentInfoFormProps) {
    const [standard, setStandard] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [goals, setGoals] = useState("");
    const [comfortableTime, setComfortableTime] = useState("");
    const [errors, setErrors] = useState<{ standard?: string; subjects?: string; comfortableTime?: string }>({});

    const toggleSubject = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject)
                ? prev.filter((s) => s !== subject)
                : [...prev, subject]
        );
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!standard) {
            newErrors.standard = "Please select your class/standard";
        }

        if (selectedSubjects.length === 0) {
            newErrors.subjects = "Please select at least one subject";
        }

        if (!comfortableTime.trim()) {
            newErrors.comfortableTime = "Please enter your comfortable study time";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onComplete({ standard, subjects: selectedSubjects, goals, comfortableTime });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl mx-auto"
        >
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <BookOpen className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold">What are you studying?</h2>
                <p className="text-foreground-muted mt-2">
                    Help us customize your learning journey
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Standard/Class Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-brand-400" />
                        Select your Class / Standard
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableStandards.map((std) => (
                            <motion.button
                                key={std}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStandard(std)}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                                    "border",
                                    standard === std
                                        ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/25"
                                        : "bg-card border-card-border hover:border-brand-400"
                                )}
                            >
                                {std}
                            </motion.button>
                        ))}
                    </div>
                    {errors.standard && (
                        <p className="text-sm text-error mt-2">{errors.standard}</p>
                    )}
                </motion.div>

                {/* Subject Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-accent-purple" />
                        Select subjects you&apos;re interested in
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {availableSubjects.map((subject, index) => {
                            const isSelected = selectedSubjects.includes(subject);
                            return (
                                <motion.button
                                    key={subject}
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleSubject(subject)}
                                    className={cn(
                                        "relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                                        "border",
                                        isSelected
                                            ? "bg-gradient-to-r from-accent-purple to-accent-pink border-transparent text-white shadow-lg"
                                            : "bg-card border-card-border hover:border-accent-purple"
                                    )}
                                >
                                    {isSelected && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                                        >
                                            <Check className="w-3 h-3 text-accent-purple" />
                                        </motion.span>
                                    )}
                                    {subject}
                                </motion.button>
                            );
                        })}
                    </div>
                    {errors.subjects && (
                        <p className="text-sm text-error mt-2">{errors.subjects}</p>
                    )}
                    <p className="text-xs text-foreground-muted mt-2">
                        Selected: {selectedSubjects.length} subjects
                    </p>
                </motion.div>

                {/* Goals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-accent-green" />
                        What are your learning goals? (Optional)
                    </label>
                    <TextArea
                        placeholder="E.g., Crack IIT JEE, improve grades, learn new skills..."
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        rows={3}
                    />
                </motion.div>

                {/* Comfortable Time */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                >
                    <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-brand-400" />
                        What time are you most comfortable studying?
                    </label>
                    <Input
                        placeholder="E.g., Evening 6 PM - 8 PM, Early Morning..."
                        value={comfortableTime}
                        onChange={(e) => setComfortableTime(e.target.value)}
                    />
                    {errors.comfortableTime && (
                        <p className="text-sm text-error mt-2">{errors.comfortableTime}</p>
                    )}
                </motion.div>

                {/* Navigation */}
                <motion.div
                    className="flex gap-4 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </Button>
                    <Button type="submit" className="flex-1">
                        Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </form>
        </motion.div>
    );
}

export default StudentInfoForm;
