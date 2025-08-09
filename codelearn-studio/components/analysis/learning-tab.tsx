"use client"

import type { AnalysisResponse } from "@/types/analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ExternalLink, Shapes } from "lucide-react"
import { useEditorStore } from "@/store/editor-store"

export function LearningTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse
  isLoading?: boolean
}) {
  const learn = data?.learning
  const lang = useEditorStore((s) => s.language)
  const hover = useEditorStore((s) => s.lspHover)

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Preparing learning tips…</div>
  }
  if (!learn) return null

  return (
    <div className="space-y-3">
      {hover && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shapes className="h-4 w-4" />
              Type under cursor
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {hover.contentsMarkdown}
            </div>
            {hover.range && (
              <div className="mt-2 text-xs text-muted-foreground">
                Range: L{hover.range.startLineNumber}:{hover.range.startColumn}–L{hover.range.endLineNumber}:
                {hover.range.endColumn}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {lang === "typescript" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4" />
              Why TypeScript?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              TypeScript adds static types to JavaScript, catching bugs earlier and improving IntelliSense. Annotations
              help document your intent and improve refactors like rename and find references.
            </div>
            <pre className="text-xs overflow-auto rounded-md border bg-muted p-3">
              <code>{`function greet(name: string): string {\n  return \`Hello, \${name}\`\n}`}</code>
            </pre>
            <div className="flex flex-wrap gap-2">
              <a
                className="text-xs text-primary underline inline-flex items-center gap-1"
                href="https://www.typescriptlang.org/docs/"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
                TypeScript Docs
              </a>
              <a
                className="text-xs text-primary underline inline-flex items-center gap-1"
                href="https://www.typescriptlang.org/tsconfig"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
                TSConfig Reference
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {learn.topics.map((t, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4" />
              {t.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">{t.explanation}</div>
            {t.example && (
              <pre className="text-xs overflow-auto rounded-md border bg-muted p-3">
                <code>{t.example}</code>
              </pre>
            )}
            <div className="flex flex-wrap gap-2">
              {t.links?.map((l, idx) => (
                <a
                  key={idx}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {l.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
