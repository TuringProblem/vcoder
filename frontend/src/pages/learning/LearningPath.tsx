import { Link, useNavigate, useParams } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProgress } from "../../data/queries/use-progress"
import type { LanguageKey } from "@/types/progress"
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

type LessonItemProps = {
  sectionId: string
  lessonNumber: number
  language: string
  completed: boolean
  locked: boolean
  canEnter: boolean
  onNavigate: (path: string) => void
}

function LessonItem({ sectionId, lessonNumber, language, completed, locked, canEnter, onNavigate }: LessonItemProps) {
  const key = `${sectionId}/lesson-${lessonNumber}`
  
  return (
    <div key={key} className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span className="text-sm">Lesson {lessonNumber}</span>
        {completed ? (
          <Badge>{t("common.completed")}</Badge>
        ) : locked ? (
          <Badge variant="secondary">{t("common.locked")}</Badge>
        ) : (
          <Badge variant="outline">{t("common.current")}</Badge>
        )}
      </div>
      <Button 
        size="sm" 
        variant={completed ? "outline" : "default"} 
        disabled={!canEnter} 
        onClick={() => onNavigate(`/course/${language}/${sectionId}/lesson-${lessonNumber}`)}
      >
        {completed ? t("common.review") : t("common.start")}
      </Button>
    </div>
  )
}

type SectionHeaderProps = {
  title: string
  unlocked: boolean
  sectionId: string
}

function SectionHeader({ title, unlocked, sectionId }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <ChevronDown className="h-4 w-4 opacity-70" />
      <span>{title}</span>
      {!unlocked && <Badge variant="secondary">{t("common.locked")}</Badge>}
    </div>
  )
}

type CourseSectionProps = {
  section: { id: string; title: string }
  language: string
  isSectionUnlocked: (sectionId: string) => boolean
  renderLesson: (sectionId: string, n: number) => React.ReactNode
}

function CourseSection({ section, language, isSectionUnlocked, renderLesson }: CourseSectionProps) {
  const unlocked = isSectionUnlocked(section.id)
  
  return (
    <AccordionItem key={section.id} value={section.id} className={unlocked ? "" : "opacity-60"} data-testid={`section-${section.id}`}>
      <AccordionTrigger data-testid={`section-trigger-${section.id}`}>
        <SectionHeader title={section.title} unlocked={unlocked} sectionId={section.id} />
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-1" data-testid={`section-content-${section.id}`}>
          {Array.from({ length: 9 }).map((_, i) => renderLesson(section.id, i + 1))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

type LanguageHeaderProps = {
  language: string
  onLanguageChange: (language: string) => void
}

function LanguageHeader({ language, onLanguageChange }: LanguageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">{t("lessons.course", { language })}</h1>
      </div>
      <LanguageSwitcher value={language} onChange={onLanguageChange} />
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
      <LessonItem
        key={key}
        sectionId={sectionId}
        lessonNumber={n}
        language={language!}
        completed={completed}
        locked={locked}
        canEnter={canEnter}
        onNavigate={navigate}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4" data-testid="learning-path-page">
        <LanguageHeader language={language!} onLanguageChange={(v) => navigate(`/course/${v}`)} />
        <div className="text-sm text-muted-foreground">{t("lessons.loadingProgress")}</div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4" data-testid="learning-path-page">
      <LanguageHeader language={language!} onLanguageChange={(v) => navigate(`/course/${v}`)} />
      <Accordion type="single" collapsible className="space-y-2" data-testid="course-accordion">
        {sections.map((section) => (
          <CourseSection
            key={section.id}
            section={section}
            language={language!}
            isSectionUnlocked={isSectionUnlocked}
            renderLesson={renderLesson}
          />
        ))}
      </Accordion>
    </div>
  )
}


