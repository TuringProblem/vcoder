"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function PerformanceTab({ data, isLoading, }) {
    if (isLoading)
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "Analyzing performance\u2026" });
    if (!data)
        return null;
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-base", children: "Performance" }) }), _jsxs(CardContent, { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Estimated Complexity" }), _jsx("div", { className: "font-medium", children: data.performance.bigO })] }), data.performance.hotspots.map((h, i) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "mt-1 inline-block h-2 w-2 rounded-full bg-orange-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: h.title }), _jsx("div", { className: "text-muted-foreground", children: h.detail })] })] }, i))), data.performance.suggestions.map((s, i) => (_jsxs("div", { className: "text-muted-foreground", children: [s.title, ": ", s.detail] }, i)))] })] }));
}
