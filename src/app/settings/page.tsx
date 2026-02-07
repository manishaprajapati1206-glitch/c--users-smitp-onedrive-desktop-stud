"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, User, Globe, Moon, Shield, Info, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { FloatingStationery } from "@/components/effects/FloatingStationery";

interface SettingsItem {
    label: string;
    desc: string;
    type: "switch" | "link" | "status";
    value?: boolean;
    onChange?: (c: boolean) => void;
    status?: string;
}

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [publicProfile, setPublicProfile] = useState(true);

    const sections: { title: string; icon: any; items: SettingsItem[] }[] = [
        {
            title: "Account",
            icon: User,
            items: [
                { label: "Profile Visibility", desc: "Make your profile public", type: "switch", value: publicProfile, onChange: setPublicProfile },
                { label: "Language", desc: "English (US)", type: "link" },
            ]
        },
        {
            title: "Preferences",
            icon: Globe,
            items: [
                { label: "Notifications", desc: "Push notifications", type: "switch", value: notifications, onChange: setNotifications },
                { label: "Email Updates", desc: "Receive weekly newsletters", type: "switch", value: emailUpdates, onChange: setEmailUpdates },
                { label: "Dark Mode", desc: "Toggle theme", type: "switch", value: darkMode, onChange: setDarkMode },
            ]
        },
        {
            title: "Security",
            icon: Shield,
            items: [
                { label: "Change Password", desc: "Last changed 3 months ago", type: "link" },
                { label: "Two-Factor Auth", desc: "Enabled", type: "status", status: "On" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-12">
            <FloatingStationery />

            <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-8"
                >
                    Settings
                </motion.h1>

                <div className="space-y-6">
                    {sections.map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm"
                        >
                            <div className="px-6 py-4 bg-background-secondary/50 border-b border-card-border flex items-center gap-3">
                                <section.icon className="w-5 h-5 text-brand-500" />
                                <h2 className="font-semibold">{section.title}</h2>
                            </div>

                            <div className="divide-y divide-card-border">
                                {section.items.map((item, j) => (
                                    <div key={item.label} className="p-6 flex items-center justify-between hover:bg-background-secondary/30 transition-colors">
                                        <div>
                                            <h3 className="font-medium text-foreground">{item.label}</h3>
                                            <p className="text-sm text-foreground-muted">{item.desc}</p>
                                        </div>

                                        {item.type === "switch" && (
                                            <Switch
                                                checked={item.value as boolean}
                                                onCheckedChange={item.onChange as (c: boolean) => void}
                                            />
                                        )}

                                        {item.type === "link" && (
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        )}

                                        {item.type === "status" && (
                                            <span className="text-sm font-bold text-accent-green bg-accent-green/10 px-3 py-1 rounded-full">
                                                {item.status}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-4"
                    >
                        <Button
                            variant="outline"
                            className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Log Out
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
