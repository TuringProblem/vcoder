"use client";

import type { AnalysisResponse } from "@/components/codelearn-studio/internal/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// in here need to do the following
//
// pass meta data for response from teh backend

export function LearningTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse;
  isLoading?: boolean;
}) {
  if (isLoading)
    return (
      <div className="text-sm text-muted-foreground">
        Preparing learning topics…
      </div>
    );
  if (!data) return null;
  return (
    <div className="space-y-3">
      <CardContent className="space-y-2 text-sm">
        <CardTitle> ayo</CardTitle>
        <div>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
            <code> </code>
          </pre>
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
