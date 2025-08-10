"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function LearningTab({ data, isLoading, }) {
    if (isLoading)
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "Preparing learning topics\u2026" });
    if (!data)
        return null;
    return (_jsx("div", { className: "space-y-3", children: data.learning.topics.map((t, i) => (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-base", children: t.title }) }), _jsxs(CardContent, { className: "space-y-2 text-sm", children: [_jsx("div", { children: t.explanation }), t.example && (_jsx("pre", { className: "bg-muted p-2 rounded text-xs overflow-auto", children: _jsx("code", { children: t.example }) })), t.links && t.links.length > 0 && (_jsx("ul", { className: "list-disc list-inside text-muted-foreground", children: t.links.map((l, j) => (_jsx("li", { children: _jsx("a", { href: l.url, target: "_blank", rel: "noreferrer", className: "underline", children: l.label }) }, j))) }))] })] }, i))) }));
}
