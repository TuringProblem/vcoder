"use client"

import type { AnalysisResponse } from "@/types/analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListOrdered, Loader2 } from "lucide-react"

export function ExecutionTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Building execution plan…
      </div>
    )
  }
  const flow = data?.executionFlow
  if (!flow) return null
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ListOrdered className="h-4 w-4" />
          Step-by-step (mock)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {flow.steps.map((s, i) => (
            <li key={i}>
              <span className="font-medium">{s.title}: </span>
              <span className="text-muted-foreground">{s.detail}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
