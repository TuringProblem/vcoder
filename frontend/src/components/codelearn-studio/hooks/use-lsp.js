"use client";
import { useEffect } from "react";
import { useEditorStore } from "@/components/codelearn-studio/store";
import { debounce } from "@/components/codelearn-studio/lib/lsp/lsp-config";
import { collectDiagnosticsForModel, getHoverAt } from "@/components/codelearn-studio/lib/lsp/typescript-lsp";
function isJsTs(langId) {
    return langId === "javascript" || langId === "typescript";
}
export function useLspDiagnosticsSync() {
    const setDiagnostics = useEditorStore((s) => s.setLspDiagnostics);
    const editor = useEditorStore((s) => s.editor);
    useEffect(() => {
        const monaco = window.monaco;
        if (!monaco || !editor)
            return;
        const update = debounce(() => {
            const model = editor.getModel();
            if (!model || !isJsTs(model.getLanguageId())) {
                setDiagnostics([]);
                return;
            }
            const d = collectDiagnosticsForModel(monaco, model);
            setDiagnostics(d);
        }, 500);
        const sub = monaco.editor.onDidChangeMarkers(update);
        const d1 = editor.onDidChangeModel(update);
        update();
        return () => {
            sub.dispose();
            d1.dispose();
        };
    }, [setDiagnostics, editor]);
}
export function useHoverSync() {
    const setHover = useEditorStore((s) => s.setLspHover);
    const editor = useEditorStore((s) => s.editor);
    useEffect(() => {
        if (!editor)
            return;
        const monaco = window.monaco;
        if (!monaco)
            return;
        const handler = debounce(async () => {
            const model = editor.getModel();
            if (!model || !isJsTs(model.getLanguageId())) {
                setHover(undefined);
                return;
            }
            try {
                const info = await getHoverAt(monaco, editor);
                setHover(info);
            }
            catch {
                setHover(undefined);
            }
        }, 500);
        const d1 = editor.onDidChangeCursorPosition(handler);
        const d2 = editor.onDidChangeModelContent(handler);
        const d3 = editor.onDidChangeModel(handler);
        handler();
        return () => {
            d1.dispose();
            d2.dispose();
            d3.dispose();
        };
    }, [editor, setHover]);
}
