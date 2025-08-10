"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/components/codelearn-studio/store";
import { useCodeAnalysis } from "@/components/codelearn-studio/hooks/use-code-analysis";
import { SyntaxTab } from "@/components/codelearn-studio/internal/analysis/SyntaxTab";
import { QualityTab } from "@/components/codelearn-studio/internal/analysis/QualityTab";
import { LearningTab } from "@/components/codelearn-studio/internal/analysis/LearningTab";
import { ExecutionTab } from "@/components/codelearn-studio/internal/analysis/ExecutionTab";
import { PerformanceTab } from "@/components/codelearn-studio/internal/analysis/PerformanceTab";
export function AnalysisPanel() {
    const language = useEditorStore((s) => s.language);
    const code = useEditorStore((s) => s.codeByLanguage[language] || "");
    const { data, isLoading, error } = useCodeAnalysis(language, code);
    const grade = data?.quality?.grade ?? "ok";
    const gradeColor = grade === "good" ? "bg-green-500" : grade === "ok" ? "bg-yellow-500" : "bg-red-500";
    return (_jsxs(Card, { className: "rounded-none md:rounded-md h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-3 border-b", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `h-2.5 w-2.5 rounded-full ${gradeColor}`, "aria-hidden": "true" }), _jsx("span", { className: "text-sm font-medium", children: "Real-time Analysis" }), _jsx(Separator, { orientation: "vertical", className: "mx-2 h-5" }), _jsx(Badge, { variant: "outline", className: "text-xs", children: language })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: isLoading ? "Analyzing…" : error ? "Error analyzing" : "Up to date" })] }), _jsx("div", { className: "p-0 md:p-3 overflow-hidden flex-1 flex flex-col", children: _jsxs(Tabs, { defaultValue: "syntax", className: "flex-1 flex flex-col", children: [_jsx("div", { className: "px-3 pt-3", children: _jsxs(TabsList, { className: "grid w-full grid-cols-5", children: [_jsx(TabsTrigger, { value: "syntax", children: "Syntax" }), _jsx(TabsTrigger, { value: "quality", children: "Quality" }), _jsx(TabsTrigger, { value: "execution", children: "Execution" }), _jsx(TabsTrigger, { value: "learning", children: "Learning" }), _jsx(TabsTrigger, { value: "performance", children: "Performance" })] }) }), _jsxs("div", { className: "flex-1 overflow-auto", children: [_jsx(TabsContent, { value: "syntax", className: "p-3", children: _jsx(SyntaxTab, { data: data, isLoading: isLoading }) }), _jsx(TabsContent, { value: "quality", className: "p-3", children: _jsx(QualityTab, { data: data, isLoading: isLoading }) }), _jsx(TabsContent, { value: "execution", className: "p-3", children: _jsx(ExecutionTab, { data: data, isLoading: isLoading }) }), _jsx(TabsContent, { value: "learning", className: "p-3", children: _jsx(LearningTab, { data: data, isLoading: isLoading }) }), _jsx(TabsContent, { value: "performance", className: "p-3", children: _jsx(PerformanceTab, { data: data, isLoading: isLoading }) })] })] }) })] }));
}
