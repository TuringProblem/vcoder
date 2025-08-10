"use client";
import { useState } from "react";
import type { AnalysisResponse } from "@/components/codelearn-studio/internal/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { getLessonPrompt } from "@/data/lessons/metadata";
import { useEditorStore } from "@/components/codelearn-studio/store";

export function LearningTab({
  data,
  isLoading,
  lessonContext,
}: {
  data?: AnalysisResponse;
  isLoading?: boolean;
  lessonContext?: {
    language: string;
    section: string;
    lesson: string;
  };
}) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const language = useEditorStore((s) => s.language);

  const lessonPrompt = lessonContext 
    ? getLessonPrompt(
        lessonContext.language as any,
        lessonContext.section as any,
        parseInt(lessonContext.lesson.replace("lesson-", ""))
      )
    : t("analysis.learning.promptPlaceholder");

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    // TODO: Implement actual question asking functionality
    // This would typically call an API to get an AI response
    setTimeout(() => {
      setIsAsking(false);
      setQuestion("");
    }, 2000);
  };

  if (isLoading)
    return (
      <div className="text-sm text-muted-foreground">
        {t("analysis.learning.preparingTopics")}
      </div>
    );
  if (!data) return null;

  return (
    <div className="space-y-3">
      <CardContent className="space-y-2 text-sm">
        <CardTitle className="text-base">{lessonPrompt}</CardTitle>
        <div className="space-y-2">
          <Input
            placeholder={t("analysis.learning.promptPlaceholder")}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
            disabled={isAsking}
          />
          <Button 
            onClick={handleAskQuestion} 
            disabled={!question.trim() || isAsking}
            size="sm"
          >
            {isAsking ? t("common.loading") : "Ask Question"}
          </Button>
        </div>
      </CardContent>
      {data.learning.topics.map((t, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>{t.explanation}</div>
            {t.example && (
              <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                <code>{t.example}</code>
              </pre>
            )}
            {t.links && t.links.length > 0 && (
              <ul className="list-disc list-inside text-muted-foreground">
                {t.links.map((l, j) => (
                  <li key={j}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
