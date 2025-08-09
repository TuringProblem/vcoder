import * as React from "react"
import { useParams } from "react-router-dom"
import { TheorySection } from "@/components/lessons/TheorySection"
import { CodeExerciseEmbed } from "@/components/lessons/CodeExerciseEmbed"
import { LanguageBadge } from "@/components/lessons/LanguageBadge"
import { NavigationControls } from "@/components/lessons/NavigationControls"

export function LessonPage({ isPractice = false }: { isPractice?: boolean }) {
  const { language = "javascript", section = "intro", lesson = "lesson-1" } = useParams()

  const context = React.useMemo(
    () => ({ language: language as any, lessonId: lesson, section, difficulty: "beginner" as const }),
    [language, section, lesson],
  )

  return (
    <div className="p-4 space-y-4">
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
        instructions="Implement the function as described above and run through the analysis."
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
    </div>
  )
}


