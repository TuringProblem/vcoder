import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { TheorySection } from "@/components/lessons/TheorySection"
import { CodeExerciseEmbed } from "@/components/lessons/CodeExerciseEmbed"
import { LanguageBadge } from "@/components/lessons/LanguageBadge"
import { NavigationControls } from "@/components/lessons/NavigationControls"
import { useAccessCheck, useCompleteLesson } from "../../data/queries/use-progress"
import type { LanguageKey, SectionKey } from "../../data/types/progress"
import { useEditorStore } from "@/components/codelearn-studio/store"
import { ModeSelect } from "@/components/ModeSelect"
import { useAddBadge } from "../../data/queries/use-profile"

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
        <div className="text-sm text-muted-foreground">Checking access…</div>
      )}
      {!isPractice && access && !access.allowed && (
        <div className="text-sm text-red-600" data-testid="lesson-locked-reason">{access.reason || "Locked"}</div>
      )}
      {!isPractice && access && !access.allowed && access.redirectPath && (
        <div>
          <button className="underline text-sm" data-testid="lesson-locked-redirect" onClick={() => navigate(access.redirectPath!)}>Go to unlocked lesson</button>
        </div>
      )}
      {!isPractice && access && !access.allowed ? null : (
      <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold" data-testid="lesson-title">{section} — {lesson}</h1>
        {/*<LanguageBadge language={language} />*/}
      </div>

      {!isPractice && (
        <div className="flex items-center gap-2 p-4 border rounded-md bg-muted/30" data-testid="dev-view-mode-select">
          <span className="text-sm font-medium">Editor Mode:</span>
          <ModeSelect
            mode={editorMode === "vim" ? "vim" : "standard"}
            onChange={(m) => setEditorMode(m === "vim" ? "vim" : "default")}
          />
        </div>
      )}

      <CodeExerciseEmbed
        context={context}
        //instructions="Implement the function as described above and run through the analysis."
        initialCode={
          language === "python"
            ? "def add(a, b):\n    return a + b\n\nprint(add(2,3))\n"
            : language === "java"
              ? "public class Main { public static void main(String[] args){ System.out.println(2+3); } }\n"
              : language === "typescript"
                ? "function add(a:number,b:number){return a+b}\nconsole.log(add(2,3))\n"
                : "function add(a,b){return a+b}\nconsole.log(add(2,3))\n"
        }
      />

      <NavigationControls prev={undefined} next={`/course/${language}/${section}/lesson-2`} />
      {!isPractice && (
        <div className="flex justify-end">
          <button
            className="px-3 py-1.5 rounded-md bg-black text-white"
            data-testid="mark-complete"
            onClick={handleMarkComplete}
            disabled={completeMutation.isPending || addBadgeMutation.isPending}
          >
            {completeMutation.isPending || addBadgeMutation.isPending ? "Completing..." : "Mark Complete"}
          </button>
        </div>
      )}
      </>
      )}
    </div>
  )
}


