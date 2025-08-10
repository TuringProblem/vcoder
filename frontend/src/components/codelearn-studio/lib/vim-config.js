"use client";
import { useEditorStore } from "@/components/codelearn-studio/store";
let vimMode = null;
let statusNode = null;
export function initVim(editor) {
    if (vimMode)
        return;
    if (!statusNode) {
        statusNode = document.createElement("span");
        statusNode.id = "vim-status-node";
    }
    import("monaco-vim").then((mod) => {
        const { initVimMode } = mod;
        vimMode = initVimMode(editor, statusNode);
        const update = () => {
            if (!vimMode)
                return;
            const text = statusNode?.textContent || "";
            useEditorStore.getState().setVimStatus(text.trim());
            if (vimMode)
                requestAnimationFrame(update);
        };
        update();
    });
}
export function disposeVim() {
    if (vimMode && typeof vimMode.dispose === "function") {
        vimMode.dispose();
    }
    vimMode = null;
    useEditorStore.getState().setVimStatus("");
}
