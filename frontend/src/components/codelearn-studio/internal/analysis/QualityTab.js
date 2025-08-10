"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, CheckCircle, ListChecks } from "lucide-react";
export function QualityTab({ data, isLoading, }) {
    const q = data?.quality;
    if (isLoading) {
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "Evaluating code quality\u2026" });
    }
    if (!q)
        return null;
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(BarChart2, { className: "h-4 w-4" }), " Score", _jsxs(Badge, { variant: "outline", children: [Math.round(q.score), "/100"] }), _jsx(Badge, { className: "capitalize", children: q.grade })] }) }), _jsxs(CardContent, { className: "grid grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "Complexity" }), _jsx("div", { className: "font-medium", children: q.complexity.cyclomatic })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "Functions" }), _jsx("div", { className: "font-medium", children: q.complexity.functions })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "Loops" }), _jsx("div", { className: "font-medium", children: q.complexity.loops })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "Lines" }), _jsx("div", { className: "font-medium", children: q.metrics.lines })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(ListChecks, { className: "h-4 w-4" }), " Best Practices"] }) }), _jsx(CardContent, { className: "space-y-2", children: q.suggestions.map((s, i) => (_jsxs("div", { className: "flex items-start gap-2 text-sm", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mt-[2px]" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: s.title }), _jsx("div", { className: "text-muted-foreground", children: s.detail }), s.why && _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Why: ", s.why] })] })] }, i))) })] })] }));
}
