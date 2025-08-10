"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "@/components/ui/badge";
import { Loader2, Info, OctagonAlert, TriangleAlert, Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProblemsPanel } from "@/components/codelearn-studio/internal/analysis/problems-panel";
import { useEditorStore } from "@/components/codelearn-studio/store";
export function SyntaxTab({ data, isLoading, }) {
    const lsp = useEditorStore((s) => s.lspDiagnostics);
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Analyzing syntax\u2026"] }));
    }
    const syntax = data?.syntax;
    if (!syntax) {
        return (_jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-2", children: [_jsx(Info, { className: "h-4 w-4" }), "Start typing to see syntax feedback."] }));
    }
    return (_jsxs("div", { className: "space-y-3", children: [syntax.issues.length === 0 ? (_jsxs("div", { className: "text-sm flex items-center gap-2", children: [_jsx(Wand2, { className: "h-4 w-4" }), "Looks good! No syntax issues detected by the mock analyzer."] })) : (syntax.issues.map((issue, idx) => (_jsx(Card, { children: _jsxs(CardContent, { className: "py-3 flex items-start gap-3", children: [issue.severity === "error" ? (_jsx(OctagonAlert, { className: "h-4 w-4 text-red-500 mt-0.5" })) : issue.severity === "warning" ? (_jsx(TriangleAlert, { className: "h-4 w-4 text-yellow-500 mt-0.5" })) : (_jsx(Info, { className: "h-4 w-4 text-blue-500 mt-0.5" })), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium", children: issue.message }), _jsxs(Badge, { variant: "outline", children: ["Line ", issue.line] }), _jsx(Badge, { variant: "secondary", className: "capitalize", children: issue.severity })] }), issue.quickFix && _jsx("div", { className: "text-muted-foreground", children: issue.quickFix }), issue.explanation && _jsx("div", { className: "text-muted-foreground text-xs", children: issue.explanation })] })] }) }, `${issue.message}-${idx}`)))), _jsx(ProblemsPanel, { diagnostics: lsp })] }));
}
