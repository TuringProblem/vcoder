"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEditorStore } from "@/store/editor-store"

export function EditorModeSelector() {
  const mode = useEditorStore((s) => s.editorMode)
  const setMode = useEditorStore((s) => s.setEditorMode)
  return (
    <Select value={mode} onValueChange={(v) => setMode(v as any)}>
      <SelectTrigger className="w-[200px]" aria-label="Editor mode">
        <SelectValue placeholder="Editor Mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="vim">Vim Motions</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
