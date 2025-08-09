export type LspSeverity = 1 | 2 | 3 | 4 // Monaco: 1=Hint, 2=Info, 3=Warning, 4=Error

export type LspDiagnostic = {
  message: string
  severity: LspSeverity
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
  source?: string
  code?: string | number
}

export type HoverInfo = {
  contentsMarkdown: string
  range?: {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }
}
