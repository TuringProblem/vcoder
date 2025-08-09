"use client"

import { useEditorStore } from "@/store/editor-store"

export function useEditorMode() {
  const mode = useEditorStore((s) => s.editorMode)
  const setMode = useEditorStore((s) => s.setEditorMode)
  const vimStatus = useEditorStore((s) => s.vimStatus)
  return { mode, setMode, vimStatus }
}
