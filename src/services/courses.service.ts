import { api } from "./api";

// Types for course data
export interface Course {
    id: string;
    title: string;
    description: string;
    duration: string; // e.g., "12 hours"
    totalLectures: number;
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
    thumbnail: string;
    progress?: number; // 0-100
    enrolled?: boolean;
}

export interface Video {
    id: string;
    courseId: string;
    title: string;
    duration: string;
    thumbnail: string;
    videoUrl?: string;
    summary?: string;
    watched?: boolean;
}

export interface Flashcard {
    id: string;
    videoId: string;
    front: string;
    back: string;
}

// Mock data for development
const mockCourses: Course[] = [
    {
        id: "maths-12",
        title: "Mathematics - 12th Standard",
        description: "Complete maths course covering calculus, algebra, and statistics for 12th standard students.",
        duration: "45 hours",
        totalLectures: 120,
        difficulty: "advanced",
        category: "Mathematics",
        thumbnail: "/images/courses/maths.jpg",
        progress: 35,
        enrolled: true,
    },
    {
        id: "ipdc-college",
        title: "IPDC - College Level",
        description: "Interpersonal Development and Communication course for college students.",
        duration: "20 hours",
        totalLectures: 48,
        difficulty: "intermediate",
        category: "Soft Skills",
        thumbnail: "/images/courses/ipdc.jpg",
        progress: 0,
        enrolled: false,
    },
    {
        id: "sst-10",
        title: "Social Studies - 10th Standard",
        description: "Comprehensive social studies covering history, civics, geography, and economics.",
        duration: "30 hours",
        totalLectures: 80,
        difficulty: "intermediate",
        category: "Social Studies",
        thumbnail: "/images/courses/sst.jpg",
        progress: 60,
        enrolled: true,
    },
    {
        id: "science-featured",
        title: "Science Fundamentals",
        description: "Master the basics of physics, chemistry, and biology with interactive lessons.",
        duration: "35 hours",
        totalLectures: 95,
        difficulty: "beginner",
        category: "Science",
        thumbnail: "/images/courses/science.jpg",
        progress: 0,
        enrolled: false,
    },
    {
        id: "english-tech",
        title: "English for Technical Communication",
        description: "Master the art of technical writing, presentations, and professional communication in the engineering and tech industry.",
        duration: "25 hours",
        totalLectures: 60,
        difficulty: "intermediate",
        category: "English",
        thumbnail: "/images/courses/english.jpg",
        progress: 0,
        enrolled: true,
    },
];

const mockVideos: Video[] = [
    {
        id: "v1",
        courseId: "maths-12",
        title: "Introduction to Calculus",
        duration: "15:30",
        thumbnail: "/images/videos/calc-intro.jpg",
        videoUrl: "https://www.youtube.com/embed/j1y8ffZZP6k",
        summary: "Learn the fundamental concepts of calculus including limits and derivatives.",
        watched: true,
    },
    {
        id: "v2",
        courseId: "maths-12",
        title: "Differential Equations",
        duration: "22:45",
        thumbnail: "/images/videos/diff-eq.jpg",
        videoUrl: "https://www.youtube.com/embed/4r-0JSfGez4",
        summary: "Understanding differential equations and their applications.",
        watched: true,
    },
    {
        id: "v3",
        courseId: "maths-12",
        title: "Integration Techniques",
        duration: "18:20",
        thumbnail: "/images/videos/integration.jpg",
        videoUrl: "https://www.youtube.com/embed/yY2oUKVAkdY",
        summary: "Master various integration techniques including substitution and parts.",
        watched: false,
    },
    {
        id: "v4",
        courseId: "english-tech",
        title: "Introduction to Technical Writing",
        duration: "15:45",
        thumbnail: "/images/videos/english-1.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        summary: "Introduction to the core principles of technical communication and writing.",
        watched: false,
    },
];

// Service functions
export const courseService = {
    // Get all courses
    getAllCourses: async (): Promise<Course[]> => {
        // In production, use: const { data } = await api.get<Course[]>("/courses");
        return mockCourses;
    },

    // Get featured courses
    getFeaturedCourses: async (): Promise<Course[]> => {
        return mockCourses.slice(0, 4);
    },

    // Get course by ID
    getCourseById: async (id: string): Promise<Course | undefined> => {
        return mockCourses.find((course) => course.id === id);
    },

    // Get videos for a course
    getCourseVideos: async (courseId: string): Promise<Video[]> => {
        return mockVideos.filter((video) => video.courseId === courseId);
    },

    // Enroll in a course
    enrollInCourse: async (courseId: string): Promise<boolean> => {
        // In production: await api.post("/courses/enroll", { courseId });
        console.log(`Enrolling in course: ${courseId}`);
        return true;
    },

    // Update course progress
    updateProgress: async (courseId: string, progress: number): Promise<boolean> => {
        console.log(`Updating progress for ${courseId}: ${progress}%`);
        return true;
    },

    // Get flashcards for a video
    getFlashcards: async (videoId: string): Promise<Flashcard[]> => {
        return [
            { id: "f1", videoId, front: "What is a derivative?", back: "The rate of change of a function at a point." },
            { id: "f2", videoId, front: "What is an integral?", back: "The reverse operation of differentiation; finds the area under a curve." },
            { id: "f3", videoId, front: "What is a limit?", back: "The value a function approaches as the input approaches a given value." },
        ];
    },
};

export default courseService;
