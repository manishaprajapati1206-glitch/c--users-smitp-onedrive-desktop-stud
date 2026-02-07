"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserCircle, Save, X, BookOpen, GraduationCap, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { userService, availableSubjects, availableStandards } from "@/services/user.service";
import { FloatingStationery } from "@/components/effects/FloatingStationery";

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [standard, setStandard] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [goals, setGoals] = useState("");

    // Load initial data
    useEffect(() => {
        const loadProfile = async () => {
            const user = await userService.getProfile();
            if (!user) {
                // User not logged in, redirect to onboarding
                router.push("/onboarding");
                return;
            }
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setStandard(user.standard);
            setSelectedSubjects(user.subjects);
            setGoals(user.goals || "");
            setLoading(false);
        };
        loadProfile();
    }, [router]);

    const toggleSubject = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject)
                ? prev.filter((s) => s !== subject)
                : [...prev, subject]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await userService.updateProfile({
                firstName,
                lastName,
                standard,
                subjects: selectedSubjects,
                goals,
            });
            router.push("/profile");
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-12">
            <FloatingStationery />

            <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-card-border rounded-3xl p-8 shadow-xl"
                >
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-accent-purple p-1">
                            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                                <UserCircle className="w-10 h-10 text-foreground-muted" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Profile</h1>
                            <p className="text-foreground-muted">Update your personal details and learning preferences</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Info */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                                required
                            />
                            <Input
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                                required
                            />
                        </div>

                        {/* Standard Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-brand-400" />
                                Class / Standard
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {availableStandards.map((std) => (
                                    <button
                                        key={std}
                                        type="button"
                                        onClick={() => setStandard(std)}
                                        className={cn(
                                            "px-3 py-2 rounded-xl text-sm font-medium transition-all border",
                                            standard === std
                                                ? "bg-brand-500 border-brand-500 text-white shadow-md"
                                                : "bg-background-secondary border-transparent hover:border-brand-400"
                                        )}
                                    >
                                        {std}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subjects Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-accent-purple" />
                                Interested Subjects
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {availableSubjects.map((subject) => {
                                    const isSelected = selectedSubjects.includes(subject);
                                    return (
                                        <button
                                            key={subject}
                                            type="button"
                                            onClick={() => toggleSubject(subject)}
                                            className={cn(
                                                "px-3 py-2 rounded-xl text-sm font-medium transition-all border text-left truncate",
                                                isSelected
                                                    ? "bg-accent-purple/10 border-accent-purple text-accent-purple"
                                                    : "bg-background-secondary border-transparent hover:border-foreground-muted"
                                            )}
                                        >
                                            {subject}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Goals */}
                        <div>
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-accent-green" />
                                Learning Goals
                            </label>
                            <TextArea
                                label=""
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                                placeholder="What do you want to achieve?"
                                rows={3}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 border-t border-card-border">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1"
                            >
                                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
