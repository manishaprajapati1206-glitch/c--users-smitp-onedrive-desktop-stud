// Service layer for API abstraction
// All API calls should go through this service

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface ApiResponse<T> {
    data: T;
    error?: string;
}

async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        return {
            data: null as T,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}

export const api = {
    get: <T>(endpoint: string) => apiRequest<T>(endpoint),

    post: <T>(endpoint: string, body: unknown) =>
        apiRequest<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: unknown) =>
        apiRequest<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string) =>
        apiRequest<T>(endpoint, {
            method: "DELETE",
        }),
};

export default api;
