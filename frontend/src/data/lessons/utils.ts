import type { LanguageKey, SectionKey } from "@/types/progress"

export function parseLessonNumber(lesson: string): number {
  const match = lesson.match(/lesson-(\d+)/)
  return match ? parseInt(match[1], 10) : 1
}

export function extractLessonContext(
  language: string,
  section: string,
  lesson: string
): {
  language: LanguageKey
  section: SectionKey
  lessonNumber: number
} {
  return {
    language: language as LanguageKey,
    section: section as SectionKey,
    lessonNumber: parseLessonNumber(lesson)
  }
}
