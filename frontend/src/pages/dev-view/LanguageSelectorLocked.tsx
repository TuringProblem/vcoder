"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEditorStore } from "@/pages/dev-view/store"
import { LanguageList } from "@/types/languages.const"

export function LanguageSelector({ lockedLanguage }: { lockedLanguage: string }) {
  const language = useEditorStore((s) => s.language)
  return (
    <Select value={language}>
      <SelectTrigger className="w-[230px]" aria-label="Language" data-disabled>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(LanguageList).map(([key, label]) => (
            <SelectItem key={key} value={key} disabled={lockedLanguage !== key}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { LanguageSelector as LanguageSelectorLocked }


