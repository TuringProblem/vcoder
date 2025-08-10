import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const API_BASE = "http://localhost:8080";
function progressKey(language) {
    return ["progress", language];
}
export function useProgress(language) {
    return useQuery({
        queryKey: progressKey(language),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/progress?language=${language}`);
            if (!res.ok)
                throw new Error("Failed to load progress");
            return (await res.json());
        },
        staleTime: 30000,
    });
}
export function useCompleteLesson() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (body) => {
            const res = await fetch(`${API_BASE}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok)
                throw new Error("Failed to complete lesson");
            return (await res.json());
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: progressKey(data.language) });
        },
    });
}
export function useAccessCheck(params, enabled = true) {
    const { language, section, lesson } = params;
    return useQuery({
        queryKey: ["access", language, section, lesson],
        queryFn: async () => {
            const url = `${API_BASE}/access-check?language=${language}&section=${section}&lesson=${lesson}`;
            const res = await fetch(url);
            if (!res.ok)
                throw new Error("Failed to check access");
            return (await res.json());
        },
        enabled,
        staleTime: 10000,
    });
}
