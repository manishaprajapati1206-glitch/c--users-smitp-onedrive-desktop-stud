"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/onboarding/AuthForm";
import { WalkthroughForm } from "@/components/onboarding/WalkthroughForm";
import { StudentInfoForm } from "@/components/onboarding/StudentInfoForm";
import { DashboardPreview } from "@/components/onboarding/DashboardPreview";
import { InfoBoard } from "@/components/onboarding/InfoBoard";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { DepthLayer } from "@/components/effects/ParallaxContainer";
import { userService } from "@/services/user.service";

interface OnboardingData {
    email: string;
    password: string;
    isSignUp: boolean;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    standard: string;
    subjects: string[];
    goals: string;
    comfortableTime: string;
}

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState<string | undefined>();

    const totalSteps = 5;

    const handleAuthComplete = async (data: { email: string; password: string; isSignUp: boolean }) => {
        setAuthLoading(true);
        setAuthError(undefined);

        const result = data.isSignUp
            ? await userService.signUp(data.email, data.password)
            : await userService.signIn(data.email, data.password);

        setAuthLoading(false);

        if (!result.success) {
            setAuthError(result.error || "Authentication failed. Please try again.");
            return;
        }

        // For sign-in: direct to home page immediately
        if (!data.isSignUp) {
            router.push("/home");
            return;
        }

        setOnboardingData((prev) => ({ ...prev, ...data }));
        setCurrentStep(1);
    };

    const handleWalkthroughComplete = (data: { firstName: string; lastName: string; dateOfBirth: string }) => {
        setOnboardingData((prev) => ({ ...prev, ...data }));
        // Save walkthrough data to profile
        userService.updateOnboarding({
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
        });
        setCurrentStep(2);
    };

    const handleStudentInfoComplete = async (data: { standard: string; subjects: string[]; goals: string; comfortableTime: string }) => {
        setOnboardingData((prev) => ({ ...prev, ...data }));

        // Send data to Zapier
        try {
            const userName = `${onboardingData.firstName || ""} ${onboardingData.lastName || ""}`.trim();
            await fetch("https://hooks.zapier.com/hooks/catch/26355867/ueu7kt9/", {
                method: "POST",
                body: JSON.stringify({
                    name: userName,
                    comfortableTime: data.comfortableTime
                })
            });
        } catch (error) {
            console.error("Failed to send data to Zapier:", error);
            // Continue even if Zapier fails
        }

        // Save student info to profile
        userService.updateOnboarding({
            standard: data.standard,
            subjects: data.subjects,
            goals: data.goals,
        });
        setCurrentStep(3);
    };

    const handleDashboardContinue = () => {
        setCurrentStep(4);
    };

    const handleStartJourney = async () => {
        // Mark onboarding as complete
        await userService.updateOnboarding({ onboardingCompleted: true });
        router.push("/home");
    };

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <DepthLayer depth={0.9} className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-40 right-20 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl" />
                </DepthLayer>
                <DepthLayer depth={0.7} className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/3 right-10 w-48 h-48 bg-accent-pink/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-accent-green/10 rounded-full blur-3xl" />
                </DepthLayer>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Progress indicator - shown for steps 0-3 */}
                {currentStep < 4 && (
                    <div className="pt-8 px-4">
                        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
                    </div>
                )}

                {/* Step Content */}
                <div className="flex-1 flex items-center justify-center px-4 py-8">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full"
                            >
                                <AuthForm onComplete={handleAuthComplete} isLoading={authLoading} serverError={authError} />
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                key="walkthrough"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full"
                            >
                                <WalkthroughForm
                                    onComplete={handleWalkthroughComplete}
                                    onBack={goBack}
                                />
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="student-info"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full"
                            >
                                <StudentInfoForm
                                    onComplete={handleStudentInfoComplete}
                                    onBack={goBack}
                                />
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="dashboard-preview"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-full"
                            >
                                <DashboardPreview
                                    userName={onboardingData.firstName || "Student"}
                                    onContinue={handleDashboardContinue}
                                    onDashboardAction={(action) => {
                                        // Map actions to routes
                                        const routes: Record<string, string> = {
                                            profile: "/profile",
                                            progress: "/profile", // Progress is part of profile
                                            settings: "/settings",
                                            leaderboard: "/leaderboard",
                                            friends: "/community"
                                        };
                                        const route = routes[action];
                                        if (route) {
                                            router.push(route);
                                        } else {
                                            console.warn("Unknown dashboard action:", action);
                                        }
                                    }}
                                />
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div
                                key="info-board"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full"
                            >
                                <InfoBoard onStart={handleStartJourney} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
