import { Link, useNavigate, useParams } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProgress } from "../../data/queries/use-progress"
import type { LanguageKey } from "../../data/types/progress"
import { ChevronDown } from "lucide-react"
import { LanguageSwitcher } from "@/components/lessons/LanguageSwitcher"



// TODO: Think of a better way to organize the sections
const sections = [
  { id: "variables", title: "Variables" },
  { id: "conditionals", title: "Conditionals" },
  { id: "loops", title: "Loops" },
  { id: "functions", title: "Functions" },
]

const languageListDiplay = (language: string) => {
  return (
    <div>
      <h1 className="text-xl font-semibold">Course: {language}</h1>
    </div>
  )
}

export function LearningPath() {
  const { language = "javascript" } = useParams()
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
          {completed ? <Badge>Completed</Badge> : locked ? <Badge variant="secondary">Locked</Badge> : <Badge variant="outline">Current</Badge>}
        </div>
        <Button size="sm" variant={completed ? "outline" : "default"} disabled={!canEnter} onClick={() => navigate(`/course/${language}/${sectionId}/lesson-${n}`)}>
          {completed ? "Review" : "Start"}
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        {languageListDiplay(language!)}
        <LanguageSwitcher value={language!} onChange={(v) => navigate(`/course/${v}`)} />
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading progress…</div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {sections.map((s) => {
            const unlocked = isSectionUnlocked(s.id)
            return (
              <AccordionItem key={s.id} value={s.id} className={unlocked ? "" : "opacity-60"}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 opacity-70" />
                    <span>{s.title}</span>
                    {!unlocked && <Badge variant="secondary">Locked</Badge>}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
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


