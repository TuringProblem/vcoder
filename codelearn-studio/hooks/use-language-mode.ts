"use client"

import { useEditorStore } from "@/store/editor-store"
import type { Language } from "@/types/analysis"

export function useLanguageMode() {
  const language = useEditorStore((s) => s.language)
  const setLanguage = useEditorStore((s) => s.setLanguage)
  const code = useEditorStore((s) => s.codeByLanguage[language] || "")
  const setCode = useEditorStore((s) => s.setCodeForLanguage)
  return { language, setLanguage, code, setCode }
}

export type { Language }
