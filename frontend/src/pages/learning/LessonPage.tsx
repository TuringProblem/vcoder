import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { TheorySection } from "@/components/lessons/TheorySection"
import { CodeExerciseEmbed } from "@/components/lessons/CodeExerciseEmbed"
import { LanguageBadge } from "@/components/lessons/LanguageBadge"
import { NavigationControls } from "@/components/lessons/NavigationControls"
import { useAccessCheck, useCompleteLesson } from "../../data/queries/use-progress"
import type { LanguageKey, SectionKey } from "@/types/progress"
import { useEditorStore } from "@/pages/dev-view/store"
import { ModeSelect } from "@/components/ModeSelect"
import { useAddBadge } from "../../data/queries/use-profile"
import { getLessonMetadata } from "../../data/lessons/metadata"
import { parseLessonNumber } from "../../data/lessons/utils"
import { t } from "@/lib/i18n"

export function LessonPage({ isPractice = false }: { isPractice?: boolean }) {
  const { language = "javascript", section = "variables", lesson = "lesson-1" } = useParams()
  const navigate = useNavigate()
  const { data: access, isLoading: checking } = useAccessCheck({
    language: language as LanguageKey,
    section,
    lesson,
  }, !isPractice)
  const completeMutation = useCompleteLesson()
  const addBadgeMutation = useAddBadge()
  const editorMode = useEditorStore((s) => s.editorMode)
  const setEditorMode = useEditorStore((s) => s.setEditorMode)

  const context = React.useMemo(
    () => ({ language: language as any, lessonId: lesson, section, difficulty: "beginner" as const }),
    [language, section, lesson],
  )

  // Get lesson metadata for initial code
  const lessonNumber = parseLessonNumber(lesson)
  const lessonData = getLessonMetadata(
    language as LanguageKey,
    section as SectionKey,
    lessonNumber
  )

  // Use lesson metadata initial code if available, otherwise fall back to defaults
  const getInitialCode = () => {
    if (lessonData?.initialCode) {
      return lessonData.initialCode
    }
    
    // Fallback to language-specific defaults
    switch (language) {
      case "python":
        return "def add(a, b):\n    return a + b\n\nprint(add(2,3))\n"
      case "java":
        return "public class Main { public static void main(String[] args){ System.out.println(2+3); } }\n"
      case "typescript":
        return "function add(a:number,b:number){return a+b}\nconsole.log(add(2,3))\n"
      default:
        return "function add(a,b){return a+b}\nconsole.log(add(2,3))\n"
    }
  }

  const handleMarkComplete = async () => {
    try {
      // Mark lesson as complete
      await completeMutation.mutateAsync({ 
        language: language as LanguageKey, 
        section: section as SectionKey, 
        lesson: lesson as `lesson-${number}` 
      })

      // Award badge for completing the lesson
      const badgeName = `${section.charAt(0).toUpperCase() + section.slice(1)} Explorer`
      const badgeDescription = `Completed ${section} section in ${language}`
      
      await addBadgeMutation.mutateAsync({
        id: `badge-${language}-${section}-${lesson}`,
        name: badgeName,
        description: badgeDescription,
        icon: "🏆",
        language: language as LanguageKey,
        section: section as SectionKey,
        earnedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to complete lesson:", error)
    }
  }

  return (
    <div className="p-4 space-y-4" data-testid="lesson-page">
      {!isPractice && checking && (
        <div className="text-sm text-muted-foreground">{t("lessons.checkingAccess")}</div>
      )}
      {!isPractice && access && !access.allowed && (
        <div className="text-sm text-red-600" data-testid="lesson-locked-reason">{access.reason || t("lessons.lessonLocked")}</div>
      )}
      {!isPractice && access && !access.allowed && access.redirectPath && (
        <div>
          <button className="underline text-sm" data-testid="lesson-locked-redirect" onClick={() => navigate(access.redirectPath!)}>{t("common.goToUnlockedLesson")}</button>
        </div>
      )}
      {!isPractice && access && !access.allowed ? null : (
      <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold" data-testid="lesson-title">
          {lessonData?.title || `${section} — ${lesson}`}
        </h1>
        {/*<LanguageBadge language={language} />*/}
      </div>

      {!isPractice && (
        <div className="flex items-center gap-2 p-4 border rounded-md bg-muted/30" data-testid="dev-view-mode-select">
          <span className="text-sm font-medium">{t("navigation.editorMode")}</span>
          <ModeSelect
            mode={editorMode === "vim" ? "vim" : "standard"}
            onChange={(m) => setEditorMode(m === "vim" ? "vim" : "default")}
          />
        </div>
      )}

      <CodeExerciseEmbed
        context={context}
        initialCode={getInitialCode()}
        instructions={lessonData?.description}
      />

      {!isPractice && (
        <NavigationControls
          onComplete={handleMarkComplete}
          onNext={() => {
            const nextLesson = lessonNumber + 1
            if (nextLesson <= 9) {
              navigate(`/course/${language}/${section}/lesson-${nextLesson}`)
            } else {
              // Move to next section
              const sections = ["variables", "conditionals", "loops", "functions"]
              const currentIndex = sections.indexOf(section)
              if (currentIndex < sections.length - 1) {
                navigate(`/course/${language}/${sections[currentIndex + 1]}/lesson-1`)
              }
            }
          }}
          onPrevious={() => {
            const prevLesson = lessonNumber - 1
            if (prevLesson >= 1) {
              navigate(`/course/${language}/${section}/lesson-${prevLesson}`)
            } else {
              // Move to previous section
              const sections = ["variables", "conditionals", "loops", "functions"]
              const currentIndex = sections.indexOf(section)
              if (currentIndex > 0) {
                navigate(`/course/${language}/${sections[currentIndex - 1]}/lesson-9`)
              }
            }
          }}
          isCompleting={completeMutation.isPending || addBadgeMutation.isPending}
        />
      )}
      </>
      )}
    </div>
  )
}


