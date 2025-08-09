import { create } from "zustand"

export type LessonKey = { language: string; section: string; lesson: string }

type Preferences = {
  theme: "light" | "dark"
  editorMode: "default" | "vim"
}

type LearningState = {
  completedLessons: Record<string, boolean>
  solutions: Record<string, string>
  preferences: Preferences
  markCompleted: (key: LessonKey) => void
  saveSolution: (key: LessonKey, code: string) => void
  setPreferences: (p: Partial<Preferences>) => void
}

function keyOf(k: LessonKey) {
  return `${k.language}/${k.section}/${k.lesson}`
}

export const useLearningStore = create<LearningState>((set) => ({
  completedLessons: {},
  solutions: {},
  preferences: { theme: "light", editorMode: "default" },
  markCompleted: (k) => set((s) => ({ completedLessons: { ...s.completedLessons, [keyOf(k)]: true } })),
  saveSolution: (k, code) => set((s) => ({ solutions: { ...s.solutions, [keyOf(k)]: code } })),
  setPreferences: (p) => set((s) => ({ preferences: { ...s.preferences, ...p } })),
}))


