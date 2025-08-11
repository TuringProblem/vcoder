import type { LanguageKey, SectionKey } from "@/types/progress";

export type LessonMetadata = {
  language: LanguageKey;
  section: SectionKey;
  lessonNumber: number;
  title?: string;
  description?: string;
  learningPrompt?: string;
  initialCode?: string;
  expectedOutput?: string;
};
