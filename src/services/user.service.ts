import { createClient } from "@/lib/supabase/client";

// Types for user data
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    standard: string;
    subjects: string[];
    goals?: string;
    avatar?: string;
    xp: number;
    level: number;
    streak: number;
    achievements: Achievement[];
    onboardingCompleted?: boolean;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
}

// Available subjects for selection
export const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "Hindi",
    "Social Studies",
    "Economics",
    "Business Studies",
    "Accountancy",
    "Psychology",
];

// Available standards/classes
export const availableStandards = [
    "8th Standard",
    "9th Standard",
    "10th Standard",
    "11th Standard",
    "12th Standard",
    "College",
];

// Helper to map DB profile to User type
function mapProfile(profile: Record<string, unknown>, email: string): User {
    return {
        id: profile.id as string,
        firstName: (profile.first_name as string) || "",
        lastName: (profile.last_name as string) || "",
        email: email,
        dateOfBirth: (profile.date_of_birth as string) || "",
        standard: (profile.standard as string) || "",
        subjects: (profile.subjects as string[]) || [],
        goals: (profile.goals as string) || "",
        avatar: (profile.avatar as string) || "",
        xp: (profile.xp as number) || 0,
        level: (profile.level as number) || 1,
        streak: (profile.streak as number) || 0,
        achievements: [],
        onboardingCompleted: (profile.onboarding_completed as boolean) || false,
    };
}

// Service functions
export const userService = {
    // Sign up new user
    signUp: async (email: string, password: string): Promise<AuthResponse> => {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.error };
        }

        return { success: true, token: data.session?.access_token };
    },

    // Sign in existing user
    signIn: async (email: string, password: string): Promise<AuthResponse> => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return { success: false, error: error.message };
        }

        // Fetch profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

        return {
            success: true,
            user: profile ? mapProfile(profile, email) : undefined,
            token: data.session?.access_token,
        };
    },

    // Sign out
    signOut: async (): Promise<void> => {
        const supabase = createClient();
        await supabase.auth.signOut();
    },

    // Get current user profile
    getProfile: async (): Promise<User | null> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (!profile) return null;

        return mapProfile(profile, user.email || "");
    },

    // Update user profile during onboarding
    updateOnboarding: async (data: Partial<User>): Promise<User | null> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const updates: Record<string, unknown> = {};
        if (data.firstName !== undefined) updates.first_name = data.firstName;
        if (data.lastName !== undefined) updates.last_name = data.lastName;
        if (data.dateOfBirth !== undefined) updates.date_of_birth = data.dateOfBirth;
        if (data.standard !== undefined) updates.standard = data.standard;
        if (data.subjects !== undefined) updates.subjects = data.subjects;
        if (data.goals !== undefined) updates.goals = data.goals;
        if (data.onboardingCompleted !== undefined) updates.onboarding_completed = data.onboardingCompleted;
        updates.updated_at = new Date().toISOString();

        const { data: profile, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id)
            .select()
            .single();

        if (error || !profile) return null;

        return mapProfile(profile, user.email || "");
    },

    // Update profile
    updateProfile: async (data: Partial<User>): Promise<User | null> => {
        return userService.updateOnboarding(data);
    },

    // Add XP
    addXP: async (amount: number): Promise<{ xp: number; level: number; levelUp: boolean }> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { xp: 0, level: 1, levelUp: false };

        const { data: profile } = await supabase
            .from("profiles")
            .select("xp, level")
            .eq("id", user.id)
            .single();

        const currentXP = (profile?.xp as number) || 0;
        const currentLevel = (profile?.level as number) || 1;
        const newXP = currentXP + amount;
        const newLevel = Math.floor(newXP / 200) + 1;
        const levelUp = newLevel > currentLevel;

        await supabase
            .from("profiles")
            .update({ xp: newXP, level: newLevel, updated_at: new Date().toISOString() })
            .eq("id", user.id);

        return { xp: newXP, level: newLevel, levelUp };
    },

    // Update streak on login — increments if last login was yesterday, resets if gap > 1 day
    updateStreak: async (): Promise<number> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return 0;

        const { data: profile } = await supabase
            .from("profiles")
            .select("streak, last_login_date")
            .eq("id", user.id)
            .single();

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const lastLogin = profile?.last_login_date as string | null;

        let newStreak: number;

        if (lastLogin === today) {
            // Already logged in today — no change
            return (profile?.streak as number) || 1;
        } else if (lastLogin) {
            const lastDate = new Date(lastLogin + "T00:00:00Z");
            const todayDate = new Date(today + "T00:00:00Z");
            const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day — increment streak
                newStreak = ((profile?.streak as number) || 0) + 1;
            } else {
                // Missed a day — reset to 1
                newStreak = 1;
            }
        } else {
            // First login ever
            newStreak = 1;
        }

        await supabase
            .from("profiles")
            .update({ streak: newStreak, last_login_date: today, updated_at: new Date().toISOString() })
            .eq("id", user.id);

        return newStreak;
    },

    // Unlock achievement
    unlockAchievement: async (achievementId: string): Promise<Achievement | null> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data: achievement } = await supabase
            .from("achievements")
            .select("*")
            .eq("id", achievementId)
            .single();

        if (!achievement) return null;

        const { error } = await supabase
            .from("user_achievements")
            .insert({ user_id: user.id, achievement_id: achievementId });

        if (error) return null;

        return {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            unlockedAt: new Date().toISOString(),
        };
    },
};

export default userService;
