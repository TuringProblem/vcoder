"use client"

import type * as monacoType from "monaco-editor"
import { useEditorStore } from "@/pages/dev-view/store"

let vimMode: any | null = null
let statusNode: HTMLSpanElement | null = null

export function initVim(editor: monacoType.editor.IStandaloneCodeEditor) {
  if (vimMode) return
  if (!statusNode) {
    statusNode = document.createElement("span")
    statusNode.id = "vim-status-node"
  }
  import("monaco-vim").then((mod: any) => {
    const { initVimMode } = mod
    vimMode = initVimMode(editor, statusNode!)
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


