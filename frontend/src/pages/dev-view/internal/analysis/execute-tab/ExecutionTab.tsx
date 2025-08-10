"use client"

import type { AnalysisResponse } from "@/types/analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ExecutionTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse
  isLoading?: boolean
}) {
  if (isLoading) return <div className="text-sm text-muted-foreground">Tracing execution…</div>
  if (!data) return null
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Execution Flow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {data.executionFlow.steps.map((s, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-foreground" />
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-muted-foreground">{s.detail}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


