"use client"

import type { AnalysisResponse } from "@/types/analysis"
import { Badge } from "@/components/ui/badge"
import { Loader2, Info, OctagonAlert, TriangleAlert, Wand2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ProblemsPanel } from "@/pages/dev-view/internal/analysis/problems-panel"
import { useEditorStore } from "@/pages/dev-view/store"

export function SyntaxTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse
  isLoading?: boolean
}) {
  const lsp = useEditorStore((s) => s.lspDiagnostics)
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Analyzing syntax…
      </div>
    )
  }
  const syntax = data?.syntax
  if (!syntax) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Info className="h-4 w-4" />
        Start typing to see syntax feedback.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {syntax.issues.length === 0 ? (
        <div className="text-sm flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Looks good! No syntax issues detected by the mock analyzer.
        </div>
      ) : (
        syntax.issues.map((issue, idx) => (
          <Card key={`${issue.message}-${idx}`}>
            <CardContent className="py-3 flex items-start gap-3">
              {issue.severity === "error" ? (
                <OctagonAlert className="h-4 w-4 text-red-500 mt-0.5" />
              ) : issue.severity === "warning" ? (
                <TriangleAlert className="h-4 w-4 text-yellow-500 mt-0.5" />
              ) : (
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              )}
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{issue.message}</span>
                  <Badge variant="outline">Line {issue.line}</Badge>
                  <Badge variant="secondary" className="capitalize">
                    {issue.severity}
                  </Badge>
                </div>
                {issue.quickFix && <div className="text-muted-foreground">{issue.quickFix}</div>}
                {issue.explanation && <div className="text-muted-foreground text-xs">{issue.explanation}</div>}
              </div>
            </CardContent>
          </Card>
        ))
      )}
      <ProblemsPanel diagnostics={lsp} />
    </div>
  )
}


