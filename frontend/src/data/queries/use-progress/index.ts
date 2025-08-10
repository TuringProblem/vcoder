import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { AccessCheckResponse, CompleteLessonRequest, LanguageKey, Progress } from "@/data/types/progress"

const API_BASE = "http://localhost:8080"

function progressKey(language: LanguageKey) {
  return ["progress", language]
}

export function useProgress(language: LanguageKey) {
  return useQuery<Progress>({
    queryKey: progressKey(language),
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/progress?language=${language}`)
      if (!res.ok) throw new Error("Failed to load progress")
      return (await res.json()) as Progress
    },
    staleTime: 30_000,
  })
}

export function useCompleteLesson() {
  const qc = useQueryClient()
  return useMutation<{ language: LanguageKey; completedLessons: Record<string, boolean> }, Error, CompleteLessonRequest>({
    mutationFn: async (body) => {
      const res = await fetch(`${API_BASE}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to complete lesson")
      return (await res.json()) as Progress
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: progressKey(data.language as LanguageKey) })
    },
  })
}

export function useAccessCheck(params: { language: LanguageKey; section: string; lesson: string }, enabled = true) {
  const { language, section, lesson } = params
  return useQuery<AccessCheckResponse>({
    queryKey: ["access", language, section, lesson],
    queryFn: async () => {
      const url = `${API_BASE}/access-check?language=${language}&section=${section}&lesson=${lesson}`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to check access")
      return (await res.json()) as AccessCheckResponse
    },
    enabled,
    staleTime: 10_000,
  })
}


