import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { LanguageSelector } from "@/components/codelearn-studio/LanguageSelectorLocked";
const MonacoEditor = React.lazy(() => import("@/components/codelearn-studio/MonacoEditor").then(m => ({ default: m.MonacoEditor })));
const AnalysisPanel = React.lazy(() => import("@/components/codelearn-studio/AnalysisPanel").then(m => ({ default: m.AnalysisPanel })));
import { useEditorStore } from "@/components/codelearn-studio/store";
export function CodeExerciseEmbed({ context, initialCode, instructions }) {
    const setLanguage = useEditorStore((s) => s.setLanguage);
    const setCodeForLanguage = useEditorStore((s) => s.setCodeForLanguage);
    React.useEffect(() => {
        const lang = context.language === "go" ? "typescript" : context.language;
        setLanguage(lang);
        if (initialCode)
            setCodeForLanguage(lang, initialCode);
    }, [context.language, initialCode, setLanguage, setCodeForLanguage]);
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(LanguageSelector, { lockedLanguage: context.language }), _jsx(React.Suspense, { fallback: _jsx("div", { className: "p-4 text-sm text-muted-foreground", children: "Loading editor\u2026" }), children: _jsx(MonacoEditor, {}) })] }), _jsxs("div", { children: [_jsx(React.Suspense, { fallback: _jsx("div", { className: "p-4 text-sm text-muted-foreground", children: "Loading analysis\u2026" }), children: _jsx(AnalysisPanel, {}) }), _jsx("div", { className: "mt-3 text-sm text-muted-foreground", children: instructions })] })] }));
}
