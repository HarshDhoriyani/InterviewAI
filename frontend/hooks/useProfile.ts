import { useEffect, useState } from "react";

export function useProfile() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/sessions/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const result = await res.json();
                setData(result);
            }
            catch (err) {
                console.error("Profile error:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { data, loading };
}