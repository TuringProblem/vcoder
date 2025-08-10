import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { TheorySection } from "@/components/lessons/TheorySection"
import { CodeExerciseEmbed } from "@/components/lessons/CodeExerciseEmbed"
import { LanguageBadge } from "@/components/lessons/LanguageBadge"
import { NavigationControls } from "@/components/lessons/NavigationControls"
import { useAccessCheck, useCompleteLesson } from "../../data/queries/use-progress"
import type { LanguageKey, SectionKey } from "../../data/types/progress"

export function LessonPage({ isPractice = false }: { isPractice?: boolean }) {
  const { language = "javascript", section = "variables", lesson = "lesson-1" } = useParams()
  const navigate = useNavigate()
  const { data: access, isLoading: checking } = useAccessCheck({
    language: language as LanguageKey,
    section,
    lesson,
  }, !isPractice)
  const completeMutation = useCompleteLesson()

  const context = React.useMemo(
    () => ({ language: language as any, lessonId: lesson, section, difficulty: "beginner" as const }),
    [language, section, lesson],
  )

  return (
    <div className="p-4 space-y-4">
      {!isPractice && checking && (
        <div className="text-sm text-muted-foreground">Checking access…</div>
      )}
      {!isPractice && access && !access.allowed && (
        <div className="text-sm text-red-600">{access.reason || "Locked"}</div>
      )}
      {!isPractice && access && !access.allowed && access.redirectPath && (
        <div>
          <button className="underline text-sm" onClick={() => navigate(access.redirectPath!)}>Go to unlocked lesson</button>
        </div>
      )}
      {!isPractice && access && !access.allowed ? null : (
      <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{section} — {lesson}</h1>
        <LanguageBadge language={language} />
      </div>

      {!isPractice && (
        <TheorySection>
          <p>
            This section explains the core concepts with examples. Adjust this copy to your curriculum and embed media as
            needed.
          </p>
        </TheorySection>
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
            onClick={() =>
              completeMutation.mutate({ language: language as LanguageKey, section: section as SectionKey, lesson: lesson as `lesson-${number}` })
            }
          >
            Mark Complete
          </button>
        </div>
      )}
      </>
      )}
    </div>
  )
}


