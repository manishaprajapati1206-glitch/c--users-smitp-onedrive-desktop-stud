"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronDown, ChevronUp, Clock, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Video } from "@/services/courses.service";

// Video Popup Modal Component
interface VideoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    video: Video;
}

function VideoPopup({ isOpen, onClose, video }: VideoPopupProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-4xl bg-background-secondary rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center">
                                    <Play className="w-5 h-5 text-brand-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{video.title}</h3>
                                    <p className="text-sm text-foreground-muted flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {video.duration}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Video Player */}
                        <div className="relative aspect-video bg-black">
                            {video.videoUrl ? (
                                <iframe
                                    src={`${video.videoUrl}?autoplay=1&rel=0`}
                                    title={video.title}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-foreground-muted">
                                    <div className="text-center">
                                        <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                                        <p>Video not available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Summary */}
                        {video.summary && (
                            <div className="p-4 bg-background-tertiary/50">
                                <p className="text-sm text-foreground-muted">{video.summary}</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface VideoCardProps {
    video: Video;
    onClick?: () => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleVideoClick = () => {
        if (video.videoUrl) {
            setIsPopupOpen(true);
        }
        onClick?.();
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="group"
            >
                <Card className="overflow-hidden p-0">
                    <div className="flex gap-4 p-4">
                        {/* Thumbnail */}
                        <div
                            className="relative w-32 h-20 bg-gradient-to-br from-brand-500/20 to-accent-purple/20 rounded-lg flex-shrink-0 cursor-pointer overflow-hidden"
                            onClick={handleVideoClick}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Play className="w-5 h-5 text-white ml-0.5" />
                                </motion.div>
                            </div>

                            {/* Watched indicator */}
                            {video.watched && (
                                <div className="absolute top-1 right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                            )}

                            {/* Duration */}
                            <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-xs text-white">
                                {video.duration}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h4
                                className="font-medium text-sm mb-1 truncate cursor-pointer hover:text-brand-400 transition-colors"
                                onClick={handleVideoClick}
                            >
                                {video.title}
                            </h4>

                            <div className="flex items-center gap-2 text-xs text-foreground-muted">
                                <Clock className="w-3 h-3" />
                                {video.duration}
                                {video.watched && (
                                    <span className="text-success">• Completed</span>
                                )}
                            </div>

                            {/* Expand button */}
                            {video.summary && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="flex items-center gap-1 mt-2 text-xs text-brand-400 hover:underline"
                                >
                                    {isExpanded ? (
                                        <>
                                            <ChevronUp className="w-3 h-3" />
                                            Hide Summary
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-3 h-3" />
                                            View Summary
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expandable Summary */}
                    <AnimatePresence>
                        {isExpanded && video.summary && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 pt-0">
                                    <div className="bg-background-secondary rounded-lg p-3 text-sm text-foreground-muted">
                                        {video.summary}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>

            {/* Video Popup Modal */}
            <VideoPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                video={video}
            />
        </>
    );
}

interface VideoListProps {
    videos: Video[];
    title?: string;
}

export function VideoList({ videos, title = "Video Suggestions" }: VideoListProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Play className="w-5 h-5 text-brand-400" />
                {title}
            </h3>
            <div className="space-y-3">
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
}

export default VideoCard;
