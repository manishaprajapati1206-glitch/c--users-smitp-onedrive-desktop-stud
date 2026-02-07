import { api } from "./api";

// Types for quiz data
export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // Index of correct option
}

export interface Quiz {
    id: string;
    courseId: string;
    title: string;
    questions: QuizQuestion[];
    passingScore: number; // Minimum correct answers to pass (e.g., 6 out of 10)
}

export interface QuizAttempt {
    quizId: string;
    answers: number[]; // Array of selected option indices
    score: number;
    passed: boolean;
    completedAt: string;
}

export interface AIQuizMessage {
    role: "ai" | "user";
    content: string;
    timestamp: string;
    isCorrect?: boolean;
}

// Mock quiz data
const mockQuizzes: Quiz[] = [
    {
        id: "quiz-maths-1",
        courseId: "maths-12",
        title: "Calculus Fundamentals Quiz",
        passingScore: 6,
        questions: [
            {
                id: "q1",
                question: "What is the derivative of x²?",
                options: ["x", "2x", "2x²", "x/2"],
                correctAnswer: 1,
            },
            {
                id: "q2",
                question: "What is the integral of 2x?",
                options: ["x", "x²", "2x²", "x² + C"],
                correctAnswer: 3,
            },
            {
                id: "q3",
                question: "What is lim(x→0) sin(x)/x?",
                options: ["0", "1", "∞", "undefined"],
                correctAnswer: 1,
            },
            {
                id: "q4",
                question: "The derivative of e^x is:",
                options: ["e", "x·e^(x-1)", "e^x", "e^(x+1)"],
                correctAnswer: 2,
            },
            {
                id: "q5",
                question: "What is d/dx(ln x)?",
                options: ["x", "1/x", "ln(x)", "e^x"],
                correctAnswer: 1,
            },
            {
                id: "q6",
                question: "The integral of 1/x is:",
                options: ["x", "x²", "ln|x| + C", "1/x²"],
                correctAnswer: 2,
            },
            {
                id: "q7",
                question: "What is the derivative of sin(x)?",
                options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
                correctAnswer: 0,
            },
            {
                id: "q8",
                question: "The chain rule is used for:",
                options: [
                    "Adding functions",
                    "Composite functions",
                    "Multiplying functions",
                    "Dividing functions",
                ],
                correctAnswer: 1,
            },
            {
                id: "q9",
                question: "What is d/dx(x³)?",
                options: ["x²", "3x", "3x²", "x³"],
                correctAnswer: 2,
            },
            {
                id: "q10",
                question: "The integral of cos(x) is:",
                options: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "-cos(x) + C"],
                correctAnswer: 0,
            },
        ],
    },
];

// Service functions
export const quizService = {
    // Get quiz for a course
    getQuizByCourse: async (courseId: string): Promise<Quiz | undefined> => {
        return mockQuizzes.find((quiz) => quiz.courseId === courseId);
    },

    // Submit quiz attempt
    submitQuiz: async (
        quizId: string,
        answers: number[]
    ): Promise<{ score: number; passed: boolean; correctAnswers: number[] }> => {
        const quiz = mockQuizzes.find((q) => q.id === quizId);
        if (!quiz) throw new Error("Quiz not found");

        const correctAnswers = quiz.questions.map((q) => q.correctAnswer);
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === correctAnswers[index]) score++;
        });

        return {
            score,
            passed: score >= quiz.passingScore,
            correctAnswers,
        };
    },

    // Get AI quiz session
    startAIQuiz: async (courseId: string): Promise<{ sessionId: string; firstQuestion: string }> => {
        return {
            sessionId: `ai-session-${Date.now()}`,
            firstQuestion: "Welcome! Let's test your understanding. What is the fundamental theorem of calculus?",
        };
    },

    // Send answer to AI quiz
    sendAIAnswer: async (
        sessionId: string,
        answer: string
    ): Promise<AIQuizMessage> => {
        // Simulate AI response
        const isCorrect = answer.length > 10; // Simple mock logic
        return {
            role: "ai",
            content: isCorrect
                ? "Great answer! You've demonstrated good understanding. Let's move to the next question."
                : "That's partially correct. Let me explain the concept better...",
            timestamp: new Date().toISOString(),
            isCorrect,
        };
    },
};

export default quizService;
