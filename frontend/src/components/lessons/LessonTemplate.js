import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
export function LessonTemplate({ title, language, sections }) {
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-semibold", children: title }), _jsx("span", { className: "text-xs px-2 py-1 rounded border capitalize", children: language })] }), _jsx("section", { children: sections.theory }), sections.codeExercise && (_jsx("section", { children: _jsx(CodeExercise, { ...sections.codeExercise }) })), sections.quiz && (_jsx("section", { children: _jsx(Quiz, { ...sections.quiz }) })), sections.additionalResources && sections.additionalResources.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "text-lg font-medium", children: "Further reading" }), _jsx("ul", { className: "list-disc list-inside text-sm", children: sections.additionalResources.map((r) => (_jsx("li", { children: _jsx("a", { className: "underline", href: r.url, target: "_blank", rel: "noreferrer", children: r.label }) }, r.url))) })] }))] }));
}
function CodeExercise(props) {
    return _jsx("div", { className: "mt-2", children: _jsx(CodeExerciseEmbed, { ...props }) });
}
import { CodeExerciseEmbed } from "@/components/lessons/CodeExerciseEmbed";
function Quiz({ question, options, answerId, onSubmit }) {
    const [selected, setSelected] = React.useState(null);
    const correct = selected != null && selected === answerId;
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "font-medium", children: "Quiz" }), _jsx("div", { className: "text-sm", children: question }), _jsx("div", { className: "space-y-1", children: options.map((o) => (_jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "radio", name: "quiz", value: o.id, onChange: () => setSelected(o.id) }), " ", o.label] }, o.id))) }), _jsx("button", { className: "px-3 py-1.5 rounded-md bg-black text-white disabled:opacity-50", disabled: !selected, onClick: () => onSubmit?.(correct), children: "Submit" }), selected && (_jsx("div", { className: `text-sm ${correct ? "text-green-600" : "text-red-600"}`, children: correct ? "Correct!" : "Try again." }))] }));
}
