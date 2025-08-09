import { jsx as _jsx } from "react/jsx-runtime";
import Editor from '@monaco-editor/react';
export function CodeEditor({ value, onChange, language = 'typescript' }) {
    const handleChange = (val) => onChange(val ?? '');
    const handleMount = (editor) => {
        editor.focus();
    };
    return (_jsx("div", { className: "h-full w-full border rounded-md overflow-hidden", children: _jsx(Editor, { height: "100%", defaultLanguage: language, value: value, onChange: handleChange, onMount: handleMount, options: {
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
            } }) }));
}
