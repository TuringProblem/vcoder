"use client"

import type { LspDiagnostic } from "@/types/lsp"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { useEditorStore } from "@/pages/dev-view/store"

type ProblemCountsProps = {
  counts: {
    error: number
    warning: number
    info: number
  }
}

function ProblemCounts({ counts }: ProblemCountsProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="destructive">Errors {counts.error}</Badge>
      <Badge variant="secondary">Warnings {counts.warning}</Badge>
      <Badge variant="outline">Info {counts.info}</Badge>
    </div>
  )
}

type ProblemItemProps = {
  diagnostic: LspDiagnostic
  index: number
  onGoTo: (diagnostic: LspDiagnostic) => void
}

function ProblemItem({ diagnostic, index, onGoTo }: ProblemItemProps) {
  const getSeverityColor = () => {
    if (diagnostic.severity === 4) return "bg-red-500"
    if (diagnostic.severity === 3) return "bg-yellow-500"
    return "bg-blue-500"
  }

  return (
    <div
      key={index}
      className="flex items-start gap-2 cursor-pointer hover:bg-muted/60 p-1 rounded"
      onClick={() => onGoTo(diagnostic)}
      role="button"
      aria-label={`Go to problem at line ${diagnostic.startLineNumber}`}
    >
      <span
        className={`mt-0.5 h-2 w-2 rounded-full ${getSeverityColor()}`}
        aria-hidden="true"
      />
      <div>
        <div className="font-medium">
          Line {diagnostic.startLineNumber}:{diagnostic.startColumn}
        </div>
        <div className="text-muted-foreground">{diagnostic.message}</div>
      </div>
    </div>
  )
}

type ProblemsListProps = {
  diagnostics: LspDiagnostic[]
  onGoTo: (diagnostic: LspDiagnostic) => void
}

function ProblemsList({ diagnostics, onGoTo }: ProblemsListProps) {
  if (diagnostics.length === 0) {
    return <div className="text-muted-foreground">No issues from the language service.</div>
  }

  return (
    <>
      {diagnostics.slice(0, 100).map((diagnostic, index) => (
        <ProblemItem key={index} diagnostic={diagnostic} index={index} onGoTo={onGoTo} />
      ))}
    </>
  )
}

export function ProblemsPanel({ diagnostics }: { diagnostics: LspDiagnostic[] }) {
  const editor = useEditorStore((s) => s.editor)

  const goTo = (d: LspDiagnostic) => {
    if (!editor) return
    editor.revealLineInCenter(d.startLineNumber)
    editor.setPosition({ lineNumber: d.startLineNumber, column: d.startColumn })
    editor.focus()
  }

  const counts = {
    error: diagnostics.filter((d) => d.severity === 4).length,
    warning: diagnostics.filter((d) => d.severity === 3).length,
    info: diagnostics.filter((d) => d.severity <= 2).length,
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-4 w-4" />
          Problems
          <ProblemCounts counts={counts} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <ProblemsList diagnostics={diagnostics} onGoTo={goTo} />
      </CardContent>
    </Card>
  )
}


