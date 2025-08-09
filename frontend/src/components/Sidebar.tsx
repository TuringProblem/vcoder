import * as React from 'react'
import type { Feedback } from '@/lib/api'

export function Sidebar({ feedback }: { feedback: Feedback[] }) {
  return (
    <aside className="w-96 border-l h-full overflow-auto bg-white/50">
      <div className="p-4 border-b font-semibold">Analysis Feedback</div>
      <ul className="p-2 space-y-2">
        {feedback.length === 0 && (
          <li className="text-sm text-muted-foreground p-2">No feedback yet. Run Analyze.</li>
        )}
        {feedback.map((f) => (
          <li key={f.id} className="p-2 rounded-md border">
            <div className="text-xs uppercase tracking-wide text-gray-500">{f.severity}</div>
            <div className="text-sm">{f.message}</div>
            <div className="text-xs text-gray-500">Line {f.line}, Col {f.column}</div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
