"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditorStore } from "@/components/codelearn-studio/store";
export function LanguageSelector({ lockedLanguage }) {
    const language = useEditorStore((s) => s.language);
    return (_jsxs(Select, { value: language, children: [_jsx(SelectTrigger, { className: "w-[230px]", "aria-label": "Language", "data-disabled": true, children: _jsx(SelectValue, { placeholder: "Language" }) }), _jsx(SelectContent, { children: _jsxs(SelectGroup, { children: [_jsx(SelectItem, { value: "javascript", disabled: lockedLanguage !== "javascript", children: "JavaScript" }), _jsx(SelectItem, { value: "typescript", disabled: lockedLanguage !== "typescript", children: "TypeScript" }), _jsx(SelectItem, { value: "python", disabled: lockedLanguage !== "python", children: "Python" }), _jsx(SelectItem, { value: "java", disabled: lockedLanguage !== "java", children: "Java" })] }) })] }));
}
export { LanguageSelector as LanguageSelectorLocked };
