"use client"

import type { AnalysisResponse } from "@/components/codelearn-studio/internal/types/analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PerformanceTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse
  isLoading?: boolean
}) {
  if (isLoading) return <div className="text-sm text-muted-foreground">Analyzing performance…</div>
  if (!data) return null
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <span className="text-xs text-muted-foreground">Estimated Complexity</span>
          <div className="font-medium">{data.performance.bigO}</div>
        </div>
        {data.performance.hotspots.map((h, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-orange-500" />
            <div>
              <div className="font-medium">{h.title}</div>
              <div className="text-muted-foreground">{h.detail}</div>
            </div>
          </div>
        ))}
        {data.performance.suggestions.map((s, i) => (
          <div key={i} className="text-muted-foreground">{s.title}: {s.detail}</div>
        ))}
      </CardContent>
    </Card>
  )
}


