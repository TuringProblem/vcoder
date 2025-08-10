"use client";
import { create } from "zustand";
import { getTemplates } from "@/components/codelearn-studio/lib/api";
const LS_KEYS = {
    code: (lang) => `cls-code-${lang}`,
};
const initialTemplates = getTemplates();
export const useEditorStore = create((set, get) => ({
    language: "javascript",
    editorMode: "default",
    theme: "dark",
    vimStatus: "",
    codeByLanguage: {
        javascript: initialTemplates.javascript,
        typescript: initialTemplates.typescript,
        python: initialTemplates.python,
        java: initialTemplates.java,
    },
    lspDiagnostics: [],
    lspHover: undefined,
    setLspDiagnostics: (d) => set({ lspDiagnostics: d }),
    setLspHover: (h) => set({ lspHover: h }),
    history: [],
    setLanguage: (l) => set({ language: l }),
    setEditorMode: (m) => set({ editorMode: m }),
    setTheme: (t) => set({ theme: t }),
    setVimStatus: (s) => set({ vimStatus: s }),
    setEditorInstance: (e) => set({ editor: e }),
    setCodeForLanguage: (l, code) => set((state) => ({
        codeByLanguage: {
            ...state.codeByLanguage,
            [l]: code,
        },
    })),
    setTemplateForLanguage: (l) => set((state) => {
        const t = initialTemplates[l];
        return {
            codeByLanguage: {
                ...state.codeByLanguage,
                [l]: t,
            },
        };
    }),
    saveCurrent: () => {
        const { language, codeByLanguage } = get();
        const code = codeByLanguage[language] || "";
        localStorage.setItem(LS_KEYS.code(language), code);
    },
    loadSaved: () => {
        const { language, setCodeForLanguage } = get();
        const saved = localStorage.getItem(LS_KEYS.code(language));
        if (typeof saved === "string") {
            setCodeForLanguage(language, saved);
        }
    },
    exportCode: () => {
        const { language, codeByLanguage } = get();
        const code = codeByLanguage[language] || "";
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download =
            language === "javascript"
                ? "code.js"
                : language === "typescript"
                    ? "code.ts"
                    : language === "python"
                        ? "code.py"
                        : "Main.java";
        a.click();
        URL.revokeObjectURL(a.href);
    },
    exportReport: () => {
        const { history } = get();
        const latest = history[history.length - 1];
        const report = latest ? JSON.stringify(latest, null, 2) : JSON.stringify({ note: "No analysis available" }, null, 2);
        const blob = new Blob([report], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `analysis-report.json`;
        a.click();
        URL.revokeObjectURL(a.href);
    },
    formatDocument: async () => {
        const ed = get().editor;
        if (!ed)
            return;
        try {
            await ed.getAction("editor.action.formatDocument").run();
        }
        catch {
            // ignore
        }
    },
    pushHistory: (h) => set((state) => {
        const items = [...state.history, h];
        return { history: items.slice(-10) };
    }),
}));
