export type LanguageKey = "javascript" | "typescript" | "python" | "java";

export type SectionKey = "variables" | "conditionals" | "loops" | "functions";

export type LessonKeyString =
  `${SectionKey}/${`lesson-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`}`;

export type Progress = {
  language: LanguageKey;
  completedLessons: Record<string, boolean>;
};

export type CompleteLessonRequest = {
  language: LanguageKey;
  section: SectionKey;
  lesson: `lesson-${number}`;
};

export type AccessCheckResponse = {
  allowed: boolean;
  redirectPath?: string;
  reason?: string;
};
