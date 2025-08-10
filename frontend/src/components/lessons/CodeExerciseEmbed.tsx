import * as React from "react"
import { LanguageSelector } from "@/pages/dev-view/LanguageSelectorLocked"
const MonacoEditor = React.lazy(() => import("@/pages/dev-view/internal/editor/MonacoEditorImpl").then(m => ({ default: m.MonacoEditor })))
const AnalysisPanel = React.lazy(() => import("@/pages/dev-view/internal/analysis/AnalysisPanelImpl").then(m => ({ default: m.AnalysisPanel })))
import { useEditorStore } from "@/pages/dev-view/store"
import { t } from "@/lib/i18n"

export type LessonLanguage = "java" | "python" | "javascript" | "typescript" | "go"

export type LessonContext = {
  language: LessonLanguage
  lessonId: string
  section: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

export type CodeExerciseProps = {
  context: LessonContext
  initialCode?: string
  expectedOutput?: string
  instructions?: string
}

export function CodeExerciseEmbed({ context, initialCode, instructions }: CodeExerciseProps) {
  const setLanguage = useEditorStore((s) => s.setLanguage)
  const setCodeForLanguage = useEditorStore((s) => s.setCodeForLanguage)

  React.useEffect(() => {
    const lang = context.language === "go" ? ("typescript" as const) : (context.language as any)
    setLanguage(lang)
    if (initialCode) setCodeForLanguage(lang, initialCode)
  }, [context.language, initialCode, setLanguage, setCodeForLanguage])

  // Create lesson context for the analysis panel
  const lessonContext = {
    language: context.language,
    section: context.section,
    lesson: context.lessonId
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="code-exercise-embed">
      <div className="space-y-2">
        {/* just cleaning this up for now... may use this somewhere else like the beginning*/}
        {/*<LanguageSelector lockedLanguage={context.language} />*/}
        <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">{t("editor.loadingEditor")}</div>}>
          <MonacoEditor />
        </React.Suspense>
      </div>
      <div>
        <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">{t("editor.loadingAnalysis")}</div>}>
          <AnalysisPanel lessonContext={lessonContext} />
        </React.Suspense>
        <div className="mt-3 text-sm text-muted-foreground">
          {instructions}
        </div>
      </div>
    </div>
  )
}


