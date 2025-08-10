import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TheorySection } from "@/components/lessons/TheorySection";
import { CodeExerciseEmbed } from "@/components/lessons/CodeExerciseEmbed";
import { LanguageBadge } from "@/components/lessons/LanguageBadge";
import { NavigationControls } from "@/components/lessons/NavigationControls";
import { useAccessCheck, useCompleteLesson } from "../../data/queries/use-progress";
export function LessonPage({ isPractice = false }) {
    const { language = "javascript", section = "variables", lesson = "lesson-1" } = useParams();
    const navigate = useNavigate();
    const { data: access, isLoading: checking } = useAccessCheck({
        language: language,
        section,
        lesson,
    }, !isPractice);
    const completeMutation = useCompleteLesson();
    const context = React.useMemo(() => ({ language: language, lessonId: lesson, section, difficulty: "beginner" }), [language, section, lesson]);
    return (_jsxs("div", { className: "p-4 space-y-4", children: [!isPractice && checking && (_jsx("div", { className: "text-sm text-muted-foreground", children: "Checking access\u2026" })), !isPractice && access && !access.allowed && (_jsx("div", { className: "text-sm text-red-600", children: access.reason || "Locked" })), !isPractice && access && !access.allowed && access.redirectPath && (_jsx("div", { children: _jsx("button", { className: "underline text-sm", onClick: () => navigate(access.redirectPath), children: "Go to unlocked lesson" }) })), !isPractice && access && !access.allowed ? null : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h1", { className: "text-xl font-semibold", children: [section, " \u2014 ", lesson] }), _jsx(LanguageBadge, { language: language })] }), !isPractice && (_jsx(TheorySection, { children: _jsx("p", { children: "This section explains the core concepts with examples. Adjust this copy to your curriculum and embed media as needed." }) })), _jsx(CodeExerciseEmbed, { context: context, 
                        //instructions="Implement the function as described above and run through the analysis."
                        initialCode: language === "python"
                            ? "def add(a, b):\n    return a + b\n\nprint(add(2,3))\n"
                            : language === "java"
                                ? "public class Main { public static void main(String[] args){ System.out.println(2+3); } }\n"
                                : language === "typescript"
                                    ? "function add(a:number,b:number){return a+b}\nconsole.log(add(2,3))\n"
                                    : "function add(a,b){return a+b}\nconsole.log(add(2,3))\n" }), _jsx(NavigationControls, { prev: undefined, next: `/course/${language}/${section}/lesson-2` }), !isPractice && (_jsx("div", { className: "flex justify-end", children: _jsx("button", { className: "px-3 py-1.5 rounded-md bg-black text-white", onClick: () => completeMutation.mutate({ language: language, section: section, lesson: lesson }), children: "Mark Complete" }) }))] }))] }));
}
