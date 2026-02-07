"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface WalkthroughFormProps {
    onComplete: (data: { firstName: string; lastName: string; dateOfBirth: string }) => void;
    onBack: () => void;
}

export function WalkthroughForm({ onComplete, onBack }: WalkthroughFormProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; dob?: string }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!firstName.trim()) {
            newErrors.firstName = "Please enter your first name";
        } else if (firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        }

        if (!lastName.trim()) {
            newErrors.lastName = "Please enter your last name";
        } else if (lastName.trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        }

        if (!dateOfBirth) {
            newErrors.dob = "Please enter your date of birth";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onComplete({ firstName, lastName, dateOfBirth });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md mx-auto"
        >
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-green to-brand-500 mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <User className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold">Tell us about yourself</h2>
                <p className="text-foreground-muted mt-2">
                    Let&apos;s personalize your learning experience
                </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name and Last Name side by side */}
                <motion.div
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Input
                        type="text"
                        placeholder="First name"
                        label="First Name"
                        icon={<User className="w-5 h-5" />}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={errors.firstName}
                    />
                    <Input
                        type="text"
                        placeholder="Last name"
                        label="Last Name"
                        icon={<User className="w-5 h-5" />}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={errors.lastName}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Input
                        type="date"
                        label="When's your birthday?"
                        icon={<Calendar className="w-5 h-5" />}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        error={errors.dob}
                    />
                </motion.div>

                <motion.div
                    className="flex gap-4 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
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

            {/* Fun element */}
            <motion.p
                className="text-center text-sm text-foreground-muted mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                🎮 You&apos;re just a few steps away from starting your adventure!
            </motion.p>
        </motion.div>
    );
}

export default WalkthroughForm;

