"use client"

import type { AnalysisResponse } from "@/types/analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, Zap } from "lucide-react"

export function PerformanceTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse
  isLoading?: boolean
}) {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Analyzing performance…</div>
  }
  const perf = data?.performance
  if (!perf) return null
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" />
            Complexity & Hotspots
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Big-O (approx)</div>
            <div className="font-medium">{perf.bigO}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Hotspots</div>
            <div className="font-medium">{perf.hotspots.length}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4" />
            Optimization Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {perf.suggestions.map((s, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium">{s.title}: </span>
              <span className="text-muted-foreground">{s.detail}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
