import * as React from "react"

export function ProgressIndicator({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)))
  return (
    <div className="w-full bg-muted rounded h-2" aria-label="Progress">
      <div className="bg-primary h-2 rounded" style={{ width: `${p}%` }} />
    </div>
  )
}


