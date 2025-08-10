import { create } from "zustand";
function keyOf(k) {
    return `${k.language}/${k.section}/${k.lesson}`;
}
export const useLearningStore = create((set) => ({
    completedLessons: {},
    solutions: {},
    preferences: { theme: "light", editorMode: "default" },
    markCompleted: (k) => set((s) => ({ completedLessons: { ...s.completedLessons, [keyOf(k)]: true } })),
    saveSolution: (k, code) => set((s) => ({ solutions: { ...s.solutions, [keyOf(k)]: code } })),
    setPreferences: (p) => set((s) => ({ preferences: { ...s.preferences, ...p } })),
}));
