import * as React from "react"
import { LanguageList } from "@/data/types/languages.const"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LanguageSwitcher({ value, onChange }: { value: string; onChange: (lang: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[200px] h-10 px-3 capitalize" aria-label="Language">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(LanguageList).map(([k, label]) => (
          <SelectItem key={k} value={k}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


