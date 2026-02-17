const API_BASE = "http://localhost:5000/api";

export const api = async (
    endpoint: string,
    method: string,
    body?: unknown,
    token?: string
) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
            "Content-type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    return res.json();
};