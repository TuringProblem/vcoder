import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { CodeEditor } from '@/components/Editor';
import { analyzeCode } from '@/lib/api';
import { useEditorMode } from '@/lib/useEditorMode';
import { ModeSelect } from '@/components/ModeSelect';
export function App() {
    const [code, setCode] = React.useState(`function hello(name: string) {\n  console.log('hello', name)\n}`);
    const [feedback, setFeedback] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [mode, setMode] = useEditorMode();
    const statusBarRef = React.useRef(null);
    const onAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeCode(code);
            setFeedback(result);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "h-screen w-screen flex", children: [_jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "p-3 border-b flex items-center gap-2", children: [_jsx("h1", { className: "font-semibold", children: "Code Analyzer" }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [_jsx(ModeSelect, { mode: mode, onChange: setMode }), _jsx("button", { onClick: onAnalyze, disabled: loading, className: "px-3 py-1.5 rounded-md bg-black text-white hover:opacity-90 disabled:opacity-50", children: loading ? 'Analyzing…' : 'Analyze' })] })] }), _jsxs("div", { className: "flex-1", children: [_jsx(CodeEditor, { value: code, onChange: setCode, mode: mode, statusBarRef: statusBarRef }), _jsx("div", { ref: statusBarRef, className: "h-6 border-t text-xs px-2 flex items-center text-gray-600 bg-gray-50" })] }), error && _jsx("div", { className: "p-2 text-sm text-red-600 border-t bg-red-50", children: error })] }), _jsx(SidebarContainer, { feedback: feedback })] }));
}
function SidebarContainer({ feedback }) {
    return (_jsx("div", { className: "h-full", children: _jsx("div", { className: "h-full", children: _jsx(Sidebar, { feedback: feedback }) }) }));
}
import { Sidebar } from '@/components/Sidebar';
