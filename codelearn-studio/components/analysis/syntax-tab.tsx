"use client"

import type { AnalysisResponse } from "@/types/analysis"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Info, OctagonAlert, TriangleAlert, Wand2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ProblemsPanel } from "./problems-panel"
import { useEditorStore } from "@/store/editor-store"

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
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No analysis yet</AlertTitle>
        <AlertDescription>Start typing to see syntax feedback.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-3">
      {syntax.issues.length === 0 ? (
        <Alert>
          <Wand2 className="h-4 w-4" />
          <AlertTitle>Looks good!</AlertTitle>
          <AlertDescription>No syntax issues detected by the mock analyzer.</AlertDescription>
        </Alert>
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
