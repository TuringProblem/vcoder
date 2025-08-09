"use client"

import type * as monacoType from "monaco-editor"
import { useEditorStore } from "@/store/editor-store"

let vimMode: any | null = null
let statusNode: HTMLSpanElement | null = null

export function initVim(editor: monacoType.editor.IStandaloneCodeEditor) {
  if (vimMode) return
  // monaco-vim expects a status bar element
  if (!statusNode) {
    statusNode = document.createElement("span")
    statusNode.id = "vim-status-node"
  }
  // Dynamically import monaco-vim to avoid SSR issues
  import("monaco-vim").then((mod: any) => {
    const { initVimMode } = mod
    vimMode = initVimMode(editor, statusNode!)
    // Update status into store every 100ms
    const update = () => {
      if (!vimMode) return
      const text = statusNode?.textContent || ""
      useEditorStore.getState().setVimStatus(text.trim())
      if (vimMode) requestAnimationFrame(update)
    }
    update()
  })
}

export function disposeVim() {
  if (vimMode && typeof vimMode.dispose === "function") {
    vimMode.dispose()
  }
  vimMode = null
  useEditorStore.getState().setVimStatus("")
}
