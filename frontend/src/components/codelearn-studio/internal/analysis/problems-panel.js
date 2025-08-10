"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useEditorStore } from "@/components/codelearn-studio/store";
export function ProblemsPanel({ diagnostics }) {
    const editor = useEditorStore((s) => s.editor);
    const goTo = (d) => {
        const e = editor;
        if (!e)
            return;
        e.revealLineInCenter(d.startLineNumber, 0);
        e.setPosition({ lineNumber: d.startLineNumber, column: d.startColumn });
        e.focus();
    };
    const counts = {
        error: diagnostics.filter((d) => d.severity === 4).length,
        warning: diagnostics.filter((d) => d.severity === 3).length,
        info: diagnostics.filter((d) => d.severity === 2).length,
    };
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), "Problems", _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "destructive", children: ["Errors ", counts.error] }), _jsxs(Badge, { variant: "secondary", children: ["Warnings ", counts.warning] }), _jsxs(Badge, { variant: "outline", children: ["Info ", counts.info] })] })] }) }), _jsx(CardContent, { className: "space-y-2 text-sm", children: diagnostics.length === 0 ? (_jsx("div", { className: "text-muted-foreground", children: "No issues from the language service." })) : (diagnostics.slice(0, 100).map((d, i) => (_jsxs("div", { className: "flex items-start gap-2 cursor-pointer hover:bg-muted/60 p-1 rounded", onClick: () => goTo(d), role: "button", "aria-label": `Go to problem at line ${d.startLineNumber}`, children: [_jsx("span", { className: `mt-0.5 h-2 w-2 rounded-full ${d.severity === 4 ? "bg-red-500" : d.severity === 3 ? "bg-yellow-500" : "bg-blue-500"}`, "aria-hidden": "true" }), _jsxs("div", { children: [_jsxs("div", { className: "font-medium", children: ["Line ", d.startLineNumber, ":", d.startColumn] }), _jsx("div", { className: "text-muted-foreground", children: d.message })] })] }, i)))) })] }));
}
