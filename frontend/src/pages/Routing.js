import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { LearningPath } from "@/pages/learning/LearningPath";
import { LessonPage } from "@/pages/learning/LessonPage";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageSelect } from "@/pages/learning/LanguageSelect";
const qc = new QueryClient();
export function AppRouter() {
    return (_jsx(QueryClientProvider, { client: qc, children: _jsx(BrowserRouter, { children: _jsx(MainLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LanguageSelect, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/course/:language", element: _jsx(LearningPath, {}) }), _jsx(Route, { path: "/course/:language/:section/:lesson", element: _jsx(LessonPage, {}) }), _jsx(Route, { path: "/code-practice/:language", element: _jsx(LessonPage, { isPractice: true }) })] }) }) }) }));
}
