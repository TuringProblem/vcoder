import { Link, useNavigate, useParams } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProgress } from "../../data/queries/use-progress"
import type { LanguageKey } from "../../data/types/progress"
import { ChevronDown } from "lucide-react"
import { LanguageSwitcher } from "@/components/lessons/LanguageSwitcher"
import { t } from "@/lib/i18n"

// TODO: Think of a better way to organize the sections
const sections = [
  { id: "variables", title: t("lessons.sections.variables") },
  { id: "conditionals", title: t("lessons.sections.conditionals") },
  { id: "loops", title: t("lessons.sections.loops") },
  { id: "functions", title: t("lessons.sections.functions") },
]

const languageListDiplay = (language: string) => {
  return (
    <div>
      <h1 className="text-xl font-semibold">{t("lessons.course", { language })}</h1>
    </div>
  )
}

export function LearningPath() {
  const { language = "" } = useParams()
  const navigate = useNavigate()
  const langKey = (language as LanguageKey) || "javascript"
  const { data, isLoading } = useProgress(langKey)

  const isSectionUnlocked = (sectionId: string) => {
    if (sectionId === "variables") return true
    const order = ["variables", "conditionals", "loops", "functions"]
    const idx = order.indexOf(sectionId)
    const prev = order[idx - 1]
    if (!prev) return true
    for (let i = 1; i <= 9; i++) {
      if (!data?.completedLessons?.[`${prev}/lesson-${i}`]) return false
    }
    return true
  }

  const renderLesson = (sectionId: string, n: number) => {
    const key = `${sectionId}/lesson-${n}`
    const completed = !!data?.completedLessons?.[key]
    const locked = n > 1 && !data?.completedLessons?.[`${sectionId}/lesson-${n - 1}`]
    const canEnter = !locked && isSectionUnlocked(sectionId)
    return (
      <div key={key} className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">Lesson {n}</span>
          {completed ? <Badge>{t("common.completed")}</Badge> : locked ? <Badge variant="secondary">{t("common.locked")}</Badge> : <Badge variant="outline">{t("common.current")}</Badge>}
        </div>
        <Button size="sm" variant={completed ? "outline" : "default"} disabled={!canEnter} onClick={() => navigate(`/course/${language}/${sectionId}/lesson-${n}`)}>
          {completed ? t("common.review") : t("common.start")}
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4" data-testid="learning-path-page">
      <div className="flex items-center justify-between">
        {languageListDiplay(language!)}
        <LanguageSwitcher value={language!} onChange={(v) => navigate(`/course/${v}`)} />
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">{t("lessons.loadingProgress")}</div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2" data-testid="course-accordion">
          {sections.map((s) => {
            const unlocked = isSectionUnlocked(s.id)
            return (
              <AccordionItem key={s.id} value={s.id} className={unlocked ? "" : "opacity-60"} data-testid={`section-${s.id}`}>
                <AccordionTrigger data-testid={`section-trigger-${s.id}`}>
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 opacity-70" />
                    <span>{s.title}</span>
                    {!unlocked && <Badge variant="secondary">{t("common.locked")}</Badge>}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1" data-testid={`section-content-${s.id}`}>
                    {Array.from({ length: 9 }).map((_, i) => renderLesson(s.id, i + 1))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </div>
  )
}


