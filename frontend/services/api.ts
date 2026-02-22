const API_BASE = "http://localhost:5000/api";

export const api = async (
    endpoint: string,
    method: string,
    body?: any
) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        credentials: "include",
        headers: {
            "Content-type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    return res.json();
};