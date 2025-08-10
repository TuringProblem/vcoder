import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageList } from "@/data/types/languages.const";
export function LanguageSelect() {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-4", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Choose a language" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: Object.entries(LanguageList).map(([key, label]) => (_jsx(Button, { variant: "outline", onClick: () => navigate(`/course/${key}`), children: label }, key))) })] }));
}
