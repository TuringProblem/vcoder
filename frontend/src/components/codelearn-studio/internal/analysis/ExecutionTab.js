"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function ExecutionTab({ data, isLoading, }) {
    if (isLoading)
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "Tracing execution\u2026" });
    if (!data)
        return null;
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-base", children: "Execution Flow" }) }), _jsx(CardContent, { className: "space-y-2 text-sm", children: data.executionFlow.steps.map((s, i) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "mt-1 inline-block h-2 w-2 rounded-full bg-foreground" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: s.title }), _jsx("div", { className: "text-muted-foreground", children: s.detail })] })] }, i))) })] }));
}
