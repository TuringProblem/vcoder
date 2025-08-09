"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEditorStore } from "@/components/codelearn-studio/store"

export function LanguageSelector({ lockedLanguage }: { lockedLanguage: string }) {
  const language = useEditorStore((s) => s.language)
  return (
    <Select value={language}>
      <SelectTrigger className="w-[230px]" aria-label="Language" data-disabled>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="javascript" disabled={lockedLanguage !== "javascript"}>
            JavaScript
          </SelectItem>
          <SelectItem value="typescript" disabled={lockedLanguage !== "typescript"}>
            TypeScript
          </SelectItem>
          <SelectItem value="python" disabled={lockedLanguage !== "python"}>
            Python
          </SelectItem>
          <SelectItem value="java" disabled={lockedLanguage !== "java"}>
            Java
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { LanguageSelector as LanguageSelectorLocked }


