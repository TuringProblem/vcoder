"use client"

import { useEditorStore } from "@/store/editor-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"

export function HistoryPanel() {
  const history = useEditorStore((s) => s.history)
  if (history.length === 0) return null
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4" />
          Recent Analyses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-xs">
        {history
          .slice(-5)
          .reverse()
          .map((h, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="text-muted-foreground">{new Date(h.createdAt).toLocaleTimeString()}</div>
              <div className="font-medium">{Math.round(h.quality.score)}</div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
