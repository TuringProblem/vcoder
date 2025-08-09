export type Language = "javascript" | "typescript" | "python" | "java"
export type Severity = "error" | "warning" | "info"

export type SyntaxIssue = {
  line: number
  severity: Severity
  message: string
  quickFix?: string
  explanation?: string
}

export type AnalysisResponse = {
  language: Language
  createdAt: string
  syntax: {
    issues: SyntaxIssue[]
  }
  quality: {
    score: number
    grade: "good" | "ok" | "poor"
    complexity: {
      cyclomatic: number
      functions: number
      loops: number
    }
    metrics: {
      lines: number
    }
    suggestions: {
      title: string
      detail: string
      why?: string
    }[]
  }
  executionFlow: {
    steps: { title: string; detail: string }[]
  }
  learning: {
    topics: {
      title: string
      explanation: string
      example?: string
      links?: { label: string; url: string }[]
    }[]
  }
  performance: {
    bigO: "O(1)" | "O(n)" | "O(n^2)"
    hotspots: { title: string; line: number; detail: string }[]
    suggestions: { title: string; detail: string }[]
  }
}


