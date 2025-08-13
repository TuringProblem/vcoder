"use client";
import { useState } from "react";
import type { AnalysisResponse } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { getLessonPrompt } from "@/data/lessons/metadata";
import { useEditorStore } from "@/pages/dev-view/store";

type QuestionInputProps = {
  question: string;
  isAsking: boolean;
  onQuestionChange: (value: string) => void;
  onAskQuestion: () => void;
};

function QuestionInput({
  question,
  isAsking,
  onQuestionChange,
  onAskQuestion,
}: QuestionInputProps) {
  return (
    <div className="space-y-2">
      <Input
        placeholder={t("analysis.learning.promptPlaceholder")}
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onAskQuestion()}
        disabled={isAsking}
      />
      <Button
        onClick={onAskQuestion}
        disabled={!question.trim() || isAsking}
        size="sm"
      >
        {isAsking ? t("common.loading") : "Ask Question"}
      </Button>
    </div>
  );
}

type LearningTopicProps = {
  topic: {
    title: string;
    explanation: string;
    example?: string;
    links?: { label: string; url: string }[];
  };
  index: number;
};

function LearningTopic({ topic, index }: LearningTopicProps) {
  return (
    <Card key={index}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{topic.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>{topic.explanation}</div>
        {topic.example && (
          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
            <code>{topic.example}</code>
          </pre>
        )}
        {topic.links && topic.links.length > 0 && (
          <ul className="list-disc list-inside text-muted-foreground">
            {topic.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

type LearningTopicsListProps = {
  topics: {
    title: string;
    explanation: string;
    example?: string;
    links?: { label: string; url: string }[];
  }[];
};

function LearningTopicsList({ topics }: LearningTopicsListProps) {
  return (
    <>
      {topics.map((topic, index) => (
        <LearningTopic key={index} topic={topic} index={index} />
      ))}
    </>
  );
}

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
        parseInt(lessonContext.lesson.replace("lesson-", "")),
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

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        {t("analysis.learning.preparingTopics")}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-3">
      <CardContent className="space-y-2 text-sm">
        <CardTitle className="text-base">{lessonPrompt}</CardTitle>
        <QuestionInput
          question={question}
          isAsking={isAsking}
          onQuestionChange={setQuestion}
          onAskQuestion={handleAskQuestion}
        />
      </CardContent>
      <LearningTopicsList topics={data.learning.topics} />
    </div>
  );
}
