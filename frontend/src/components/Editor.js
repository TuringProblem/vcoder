import { jsx as _jsx } from "react/jsx-runtime";
import Editor from "@monaco-editor/react";
import * as React from "react";
export function CodeEditor({ value, onChange, language = "typescript", mode = "standard", className, statusBarRef, }) {
    const handleChange = (val) => onChange(val ?? "");
    const vimInstanceRef = React.useRef(null);
    const editorRef = React.useRef(null);
    const handleMount = async (editor) => {
        editorRef.current = editor;
        editor.focus();
    };
    // Toggle vim dynamically when mode changes
    React.useEffect(() => {
        const editor = editorRef.current;
        if (!editor)
            return;
        let cancelled = false;
        const enableVim = async () => {
            if (vimInstanceRef.current)
                return;
            const mod = (await import("monaco-vim"));
            if (cancelled)
                return;
            vimInstanceRef.current = new mod.VimMode(editor, statusBarRef?.current ?? null);
        };
        if (mode === "vim") {
            enableVim();
        }
        else {
            // disable vim
            if (vimInstanceRef.current) {
                vimInstanceRef.current.dispose();
                vimInstanceRef.current = null;
            }
        }
        return () => {
            cancelled = true;
        };
    }, [mode, statusBarRef]);
    return (_jsx("div", { className: "h-full w-full border rounded-md overflow-hidden " + (className ?? ""), children: _jsx(Editor, { height: "100%", defaultLanguage: language, value: value, onChange: handleChange, onMount: handleMount, theme: "vs-dark", options: {
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
            } }) }));
}
