"use client"

import type { LspDiagnostic } from "@/types/lsp"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { useEditorStore } from "@/pages/dev-view/store"

export function ProblemsPanel({ diagnostics }: { diagnostics: LspDiagnostic[] }) {
  const editor = useEditorStore((s) => s.editor)

  const goTo = (d: LspDiagnostic) => {
    const e = editor
    if (!e) return
    e.revealLineInCenter(d.startLineNumber, 0)
    e.setPosition({ lineNumber: d.startLineNumber, column: d.startColumn })
    e.focus()
  }

  const counts = {
    error: diagnostics.filter((d) => d.severity === 4).length,
    warning: diagnostics.filter((d) => d.severity === 3).length,
    info: diagnostics.filter((d) => d.severity === 2).length,
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-4 w-4" />
          Problems
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Errors {counts.error}</Badge>
            <Badge variant="secondary">Warnings {counts.warning}</Badge>
            <Badge variant="outline">Info {counts.info}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {diagnostics.length === 0 ? (
          <div className="text-muted-foreground">No issues from the language service.</div>
        ) : (
          diagnostics.slice(0, 100).map((d, i) => (
            <div
              key={i}
              className="flex items-start gap-2 cursor-pointer hover:bg-muted/60 p-1 rounded"
              onClick={() => goTo(d)}
              role="button"
              aria-label={`Go to problem at line ${d.startLineNumber}`}
            >
              <span
                className={`mt-0.5 h-2 w-2 rounded-full ${
                  d.severity === 4 ? "bg-red-500" : d.severity === 3 ? "bg-yellow-500" : "bg-blue-500"
                }`}
                aria-hidden="true"
              />
              <div>
                <div className="font-medium">
                  Line {d.startLineNumber}:{d.startColumn}
                </div>
                <div className="text-muted-foreground">{d.message}</div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}


