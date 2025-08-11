import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TheorySection } from "@/components/lessons/TheorySection";
import { CodeExerciseEmbed } from "@/components/lessons/CodeExerciseEmbed";
import { LanguageBadge } from "@/components/lessons/LanguageBadge";
import { NavigationControls } from "@/components/lessons/NavigationControls";
import {
  useAccessCheck,
  useCompleteLesson,
} from "../../data/queries/use-progress";
import type { LanguageKey, SectionKey } from "@/types/progress";
import { useEditorStore } from "@/pages/dev-view/store";
import { ModeSelect } from "@/components/ModeSelect";
import { useAddBadge } from "../../data/queries/use-profile";
import { getLessonMetadata } from "../../data/lessons/metadata";
import { parseLessonNumber } from "../../data/lessons/utils";
import { t } from "@/lib/i18n";

type AccessCheckProps = {
  isPractice: boolean;
  checking: boolean;
  access: any;
  onNavigate: (path: string) => void;
};

function AccessCheck({
  isPractice,
  checking,
  access,
  onNavigate,
}: AccessCheckProps) {
  if (isPractice) return null;

  if (checking) {
    return (
      <div className="text-sm text-muted-foreground">
        {t("lessons.checkingAccess")}
      </div>
    );
  }

  if (access && !access.allowed) {
    return (
      <>
        <div
          className="text-sm text-red-600"
          data-testid="lesson-locked-reason"
        >
          {access.reason || t("lessons.lessonLocked")}
        </div>
        {access.redirectPath && (
          <div>
            <button
              className="underline text-sm"
              data-testid="lesson-locked-redirect"
              onClick={() => onNavigate(access.redirectPath!)}
            >
              {t("common.goToUnlockedLesson")}
            </button>
          </div>
        )}
      </>
    );
  }

  return null;
}

type LessonHeaderProps = {
  title: string;
};

function LessonHeader({ title }: LessonHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold" data-testid="lesson-title">
        {title}
      </h1>
      {/*<LanguageBadge language={language} />*/}
    </div>
  );
}

type EditorModeSelectorProps = {
  isPractice: boolean;
  editorMode: string;
  onEditorModeChange: (mode: string) => void;
};

function EditorModeSelector({
  isPractice,
  editorMode,
  onEditorModeChange,
}: EditorModeSelectorProps) {
  if (isPractice) return null;

  return (
    <div
      className="flex items-center gap-2 p-4 border rounded-md bg-muted/30"
      data-testid="dev-view-mode-select"
    >
      <span className="text-sm font-medium">{t("navigation.editorMode")}</span>
      <div className="flex items-center gap-2 pd-8 border rounded-md bg-red-100 w-20 ">
        <ModeSelect
          mode={editorMode === "vim" ? "vim" : "standard"}
          onChange={(m) => onEditorModeChange(m === "vim" ? "vim" : "default")}
        />
      </div>
    </div>
  );
}

type LessonNavigationProps = {
  isPractice: boolean;
  language: string;
  section: string;
  lessonNumber: number;
  onNavigate: (path: string) => void;
  onComplete: () => void;
  isCompleting: boolean;
};

function LessonNavigation({
  isPractice,
  language,
  section,
  lessonNumber,
  onNavigate,
  onComplete,
  isCompleting,
}: LessonNavigationProps) {
  if (isPractice) return null;

  const handleNext = () => {
    const nextLesson = lessonNumber + 1;
    if (nextLesson <= 9) {
      onNavigate(`/course/${language}/${section}/lesson-${nextLesson}`);
    } else {
      // Move to next section
      const sections = ["variables", "conditionals", "loops", "functions"];
      const currentIndex = sections.indexOf(section);
      if (currentIndex < sections.length - 1) {
        onNavigate(
          `/course/${language}/${sections[currentIndex + 1]}/lesson-1`,
        );
      }
    }
  };

  const handlePrevious = () => {
    const prevLesson = lessonNumber - 1;
    if (prevLesson >= 1) {
      onNavigate(`/course/${language}/${section}/lesson-${prevLesson}`);
    } else {
      // Move to previous section
      const sections = ["variables", "conditionals", "loops", "functions"];
      const currentIndex = sections.indexOf(section);
      if (currentIndex > 0) {
        onNavigate(
          `/course/${language}/${sections[currentIndex - 1]}/lesson-9`,
        );
      }
    }
  };

  return (
    <NavigationControls
      onComplete={onComplete}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isCompleting={isCompleting}
    />
  );
}

export function LessonPage({ isPractice = false }: { isPractice?: boolean }) {
  const {
    language = "javascript",
    section = "variables",
    lesson = "lesson-1",
  } = useParams();
  const navigate = useNavigate();
  const { data: access, isLoading: checking } = useAccessCheck(
    {
      language: language as LanguageKey,
      section,
      lesson,
    },
    !isPractice,
  );
  const completeMutation = useCompleteLesson();
  const addBadgeMutation = useAddBadge();
  const editorMode = useEditorStore((s) => s.editorMode);
  const setEditorMode = useEditorStore((s) => s.setEditorMode);

  const context = React.useMemo(
    () => ({
      language: language as any,
      lessonId: lesson,
      section,
      difficulty: "beginner" as const,
    }),
    [language, section, lesson],
  );

  // Get lesson metadata for initial code
  const lessonNumber = parseLessonNumber(lesson);
  const lessonData = getLessonMetadata(
    language as LanguageKey,
    section as SectionKey,
    lessonNumber,
  );

  // Use lesson metadata initial code if available, otherwise fall back to defaults
  const getInitialCode = () => {
    if (lessonData?.initialCode) {
      return lessonData.initialCode;
    }

    // Fallback to language-specific defaults
    switch (language) {
      case "python":
        return "def add(a, b):\n    return a + b\n\nprint(add(2,3))\n";
      case "java":
        return "public class Main { public static void main(String[] args){ System.out.println(2+3); } }\n";
      case "typescript":
        return "function add(a:number,b:number){return a+b}\nconsole.log(add(2,3))\n";
      default:
        return "function add(a,b){return a+b}\nconsole.log(add(2,3))\n";
    }
  };

  const handleMarkComplete = async () => {
    try {
      // Mark lesson as complete
      await completeMutation.mutateAsync({
        language: language as LanguageKey,
        section: section as SectionKey,
        lesson: lesson as `lesson-${number}`,
      });

      // Award badge for completing the lesson
      const badgeName = `${section.charAt(0).toUpperCase() + section.slice(1)} Explorer`;
      const badgeDescription = `Completed ${section} section in ${language}`;

      await addBadgeMutation.mutateAsync({
        id: `badge-${language}-${section}-${lesson}`,
        name: badgeName,
        description: badgeDescription,
        icon: "🏆",
        language: language as LanguageKey,
        section: section as SectionKey,
        earnedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    }
  };

  const lessonTitle = lessonData?.title || `${section} — ${lesson}`;
  const isAccessDenied = !isPractice && access && !access.allowed;

  return (
    <div className="p-4 space-y-4" data-testid="lesson-page">
      <AccessCheck
        isPractice={isPractice}
        checking={checking}
        access={access}
        onNavigate={navigate}
      />

      {!isAccessDenied && (
        <>
          <LessonHeader title={lessonTitle} />

          <EditorModeSelector
            isPractice={isPractice}
            editorMode={editorMode}
            onEditorModeChange={setEditorMode}
          />

          <CodeExerciseEmbed
            context={context}
            initialCode={getInitialCode()}
            instructions={lessonData?.description}
          />

          <LessonNavigation
            isPractice={isPractice}
            language={language}
            section={section}
            lessonNumber={lessonNumber}
            onNavigate={navigate}
            onComplete={handleMarkComplete}
            isCompleting={
              completeMutation.isPending || addBadgeMutation.isPending
            }
          />
        </>
      )}
    </div>
  );
}
