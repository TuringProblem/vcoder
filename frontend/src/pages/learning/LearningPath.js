import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgress } from "../../data/queries/use-progress";
// TODO: Think of a better way to organize the sections
const sections = [
    { id: "variables", title: "Variables" },
    { id: "conditionals", title: "Conditionals" },
    { id: "loops", title: "Loops" },
    { id: "functions", title: "Functions" },
];
const languageListDiplay = (language) => {
    return (_jsx("div", { children: _jsxs("h1", { className: "text-xl font-semibold", children: ["Course: ", language] }) }));
};
export function LearningPath() {
    const { language = "javascript" } = useParams();
    const navigate = useNavigate();
    const langKey = language || "javascript";
    const { data, isLoading } = useProgress(langKey);
    const isSectionUnlocked = (sectionId) => {
        if (sectionId === "variables")
            return true;
        const order = ["variables", "conditionals", "loops", "functions"];
        const idx = order.indexOf(sectionId);
        const prev = order[idx - 1];
        if (!prev)
            return true;
        for (let i = 1; i <= 9; i++) {
            if (!data?.completedLessons?.[`${prev}/lesson-${i}`])
                return false;
        }
        return true;
    };
    const renderLesson = (sectionId, n) => {
        const key = `${sectionId}/lesson-${n}`;
        const completed = !!data?.completedLessons?.[key];
        const locked = n > 1 && !data?.completedLessons?.[`${sectionId}/lesson-${n - 1}`];
        const canEnter = !locked && isSectionUnlocked(sectionId);
        return (_jsxs("div", { className: "flex items-center justify-between py-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm", children: ["Lesson ", n] }), completed ? _jsx(Badge, { children: "Completed" }) : locked ? _jsx(Badge, { variant: "secondary", children: "Locked" }) : _jsx(Badge, { variant: "outline", children: "Current" })] }), _jsx(Button, { size: "sm", variant: completed ? "outline" : "default", disabled: !canEnter, onClick: () => navigate(`/course/${language}/${sectionId}/lesson-${n}`), children: completed ? "Review" : "Start" })] }, key));
    };
    return (_jsxs("div", { className: "p-4 space-y-4", children: [languageListDiplay(language), isLoading ? (_jsx("div", { className: "text-sm text-muted-foreground", children: "Loading progress\u2026" })) : (_jsx(Accordion, { type: "single", collapsible: true, className: "space-y-2", children: sections.map((s) => {
                    const unlocked = isSectionUnlocked(s.id);
                    return (_jsxs(AccordionItem, { value: s.id, className: unlocked ? "" : "opacity-60", children: [_jsx(AccordionTrigger, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: s.title }), !unlocked && _jsx(Badge, { variant: "secondary", children: "Locked" })] }) }), _jsx(AccordionContent, { children: _jsx("div", { className: "space-y-1", children: Array.from({ length: 9 }).map((_, i) => renderLesson(s.id, i + 1)) }) })] }, s.id));
                }) }))] }));
}
