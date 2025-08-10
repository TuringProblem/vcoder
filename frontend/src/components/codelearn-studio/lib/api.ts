"use client"

import type { AnalysisResponse, Language, Severity } from "@/components/codelearn-studio/internal/types/analysis"
import { t } from "@/lib/i18n"

export function getTemplates(): Record<Language, string> {
  return {
    javascript: `// Welcome to CodeLearn Studio (JavaScript)
// Try editing this example and watch the analysis update in real-time.

function greet(name) {
  const message = "Hello, " + name + "!";
  console.log(message);
}

for (let i = 0; i < 3; i++) {
  greet("Student " + i);
}
`,
    typescript: `// Welcome to CodeLearn Studio (TypeScript)
// Try editing this TypeScript example and hover to see types.

interface Person {
  id: number;
  name: string;
}

function greet(p: Person): string {
  return "Hello, " + p.name + " (#" + p.id + ")";
}

const students: Person[] = [{ id: 1, name: "Alex" }, { id: 2, name: "Riley" }];

for (const s of students) {
  console.log(greet(s));
}
`,
    python: `# Welcome to CodeLearn Studio (Python)
# Try editing this example and watch the analysis update in real-time.

def greet(name):
    message = f"Hello, {name}!"
    print(message)

for i in range(3):
    greet(f"Student {i}")
`,
    java: `// Welcome to CodeLearn Studio (Java)
// Try editing this example and watch the analysis update in real-time.

public class Main {
    public static void main(String[] args) {
        greet("Student");
        for (int i = 0; i < 3; i++) {
            greet("Student " + i);
        }
    }

    static void greet(String name) {
        String message = "Hello, " + name + "!";
        System.out.println(message);
    }
}
`,
  }
}

function countOccurrences(text: string, patterns: RegExp[]) {
  return patterns.reduce((acc, r) => acc + (text.match(r) || []).length, 0)
}

function basicSyntaxScan(language: Language, code: string) {
  const lines = code.split(/\r?\n/)
  const issues: AnalysisResponse["syntax"]["issues"] = []
  const add = (line: number, severity: Severity, message: string, quickFix?: string, explanation?: string) => {
    issues.push({ line, severity, message, quickFix, explanation })
  }

  let braceBalance = 0
  lines.forEach((ln, i) => {
    for (const ch of ln) {
      if (ch === "{") braceBalance++
      if (ch === "}") braceBalance--
    }
    if (ln.length > 120) {
      add(i + 1, "info", "Line too long (>120 chars)", "Break into multiple lines.")
    }
  })
  if (braceBalance !== 0 && (language === "javascript" || language === "typescript" || language === "java")) {
    add(
      1,
      "error",
      "Unbalanced braces detected",
      "Check { and } pairs.",
      "Every opening brace should have a matching closing brace.",
    )
  }

  if (language === "javascript" || language === "typescript") {
    lines.forEach((ln, i) => {
      if (/^\s*(const|let|var|return|console\.log|if|for|while|function|interface|type|export|import)/.test(ln)) {
        if (!/[;{\s]$/.test(ln.trim()) && !/^\s*(export|import)/.test(ln.trim())) {
          add(i + 1, "info", "Consider consistent semicolons", "Enable a formatter or linter.")
        }
      }
    })
  } else if (language === "python") {
    lines.forEach((ln, i) => {
      if (/^\s*(def|if|for|while|class)\b.*[^:]\s*$/.test(ln)) {
        add(i + 1, "error", "Missing ':' at end of statement", "Add ':'", "Blocks require a colon.")
      }
      if (/\t/.test(ln)) {
        add(i + 1, "warning", "Tab indentation detected", "Use 4 spaces.", "Python prefers spaces.")
      }
    })
  } else if (language === "java") {
    lines.forEach((ln, i) => {
      if (/^\s*(int|String|boolean|double|float|char|long|short|byte|System\.out\.println|return)\b/.test(ln)) {
        if (!/[;{\s]$/.test(ln.trim())) {
          add(i + 1, "error", "Missing semicolon", "Add ';' to the end.")
        }
      }
      if (/public\s+class\b/.test(ln) && !/\{/.test(ln)) {
        add(i + 1, "warning", "Class declaration without '{' on same line", "Open class block.")
      }
    })
  }

  return { issues }
}

function qualityChecks(language: Language, code: string) {
  const lines = code.split(/\r?\n/)
  const functions =
    language === "python"
      ? countOccurrences(code, [/def\s+\w+\s*\(/g])
      : language === "java"
        ? countOccurrences(code, [/\w+\s+\w+\s*$$.*$$\s*\{/g])
        : countOccurrences(code, [/function\s+\w+\s*\(/g, /\w+\s*=\s*\(/g])
  const loops = countOccurrences(code, [/for\s*\(/g, /while\s*\(/g, /for\s+\w+\s+in/g])
  const conditionals = countOccurrences(code, [/if\s*\(/g, /\belif\b/g, /\belse\b/g, /\bswitch\b/g])

  const cyclomatic = 1 + loops + conditionals
  const lineCount = lines.length
  let score = 100
  score -= Math.max(0, cyclomatic - 10) * 2
  score -= Math.max(0, lineCount - 200) * 0.2

  const suggestions: { title: string; detail: string; why?: string }[] = []
  if (loops > 3) {
    suggestions.push({
      title: t("quality.suggestions.simplifyLoops.title"),
      detail: t("quality.suggestions.simplifyLoops.detail"),
      why: t("quality.suggestions.simplifyLoops.why"),
    })
  }
  if (language === "javascript" && /var\s+/.test(code)) {
    suggestions.push({
      title: t("quality.suggestions.preferLetConst.title"),
      detail: t("quality.suggestions.preferLetConst.detail"),
      why: t("quality.suggestions.preferLetConst.why"),
    })
    score -= 5
  }
  if (language === "typescript" && !/:/.test(code.split("\n").slice(0, 50).join("\n"))) {
    suggestions.push({
      title: t("quality.suggestions.addTypeAnnotations.title"),
      detail: t("quality.suggestions.addTypeAnnotations.detail"),
      why: t("quality.suggestions.addTypeAnnotations.why"),
    })
    score -= 3
  }
  if (
    language === "python" &&
    /[A-Z]/.test(code.split(/\W+/).find((t) => /^[a-zA-Z_]+$/.test(t) && t === t.toUpperCase()) || "")
  ) {
    suggestions.push({
      title: "Use snake_case for variables",
      detail: "Python style guide (PEP8) prefers snake_case.",
      why: "Consistency aids readability.",
    })
  }
  if (language === "java" && /public\s+class\s+(\w+)/.test(code)) {
    const className = /public\s+class\s+(\w+)/.exec(code)?.[1] || ""
    if (!/^[A-Z][A-Za-z0-9]*$/.test(className)) {
      suggestions.push({
        title: "Class naming convention",
        detail: `Use PascalCase for class names (e.g., ${className || "MyClass"}).`,
      })
      score -= 3
    }
  }

  const grade: "good" | "ok" | "poor" = score >= 80 ? "good" : score >= 60 ? "ok" : "poor"

  return {
    score,
    grade,
    complexity: { cyclomatic, functions, loops },
    metrics: { lines: lineCount },
    suggestions,
  }
}

function learningContent(language: Language, code: string) {
  const topics: AnalysisResponse["learning"]["topics"] = []

  if (language === "javascript" && /for\s+of/.test(code) === false && /for\s*\(/.test(code)) {
    topics.push({
      title: t("learning.topics.forOfLoops.title"),
      explanation: t("learning.topics.forOfLoops.explanation"),
      example: t("learning.topics.forOfLoops.example"),
      links: [
        {
          label: t("learning.topics.forOfLoops.link"),
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of",
        },
      ],
    })
  }

  if (language === "typescript") {
    topics.push({
      title: t("learning.topics.interfacesVsTypes.title"),
      explanation: t("learning.topics.interfacesVsTypes.explanation"),
      example: t("learning.topics.interfacesVsTypes.example"),
      links: [
        { label: t("learning.topics.interfacesVsTypes.link"), url: "https://www.typescriptlang.org/docs/handbook/interfaces.html" },
      ],
    })
    topics.push({
      title: t("learning.topics.generics.title"),
      explanation: t("learning.topics.generics.explanation"),
      example: t("learning.topics.generics.example"),
      links: [{ label: t("learning.topics.generics.link"), url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }],
    })
  }

  if (language === "python" && /range\(/.test(code)) {
    topics.push({
      title: t("learning.topics.forEachLoops.title"),
      explanation: t("learning.topics.forEachLoops.explanation"),
      example: t("learning.topics.forEachLoops.example"),
      links: [{ label: t("learning.topics.forEachLoops.link"), url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements" }],
    })
  }

  if (language === "java" && /for\s*\(/.test(code) && !/:\s*\)/.test(code)) {
    topics.push({
      title: t("learning.topics.enhancedForEach.title"),
      explanation: t("learning.topics.enhancedForEach.explanation"),
      example: t("learning.topics.enhancedForEach.example"),
      links: [
        {
          label: t("learning.topics.enhancedForEach.link"),
          url: "https://docs.oracle.com/javase/8/docs/technotes/guides/language/foreach.html",
        },
      ],
    })
  }

  return { topics }
}

function performanceAnalysis(language: Language, code: string) {
  const loops = countOccurrences(code, [/for\s*\(/g, /while\s*\(/g, /for\s+\w+\s+in/g])
  const nestedLoops = (code.match(/for\s*\(.*\{[\s\S]*for\s*\(/g) || []).length
  const bigO: "O(1)" | "O(n)" | "O(n^2)" = nestedLoops > 0 ? "O(n^2)" : loops > 0 ? "O(n)" : "O(1)"
  const hotspots: { title: string; line: number; detail: string }[] = []
  if (nestedLoops > 0) {
    hotspots.push({ title: t("performance.hotspots.nestedLoops.title"), line: 1, detail: t("performance.hotspots.nestedLoops.detail") })
  }
  const suggestions: { title: string; detail: string }[] = []
  if (bigO !== "O(1)") {
    suggestions.push({
      title: t("performance.suggestions.useEarlyExits.title"),
      detail: t("performance.suggestions.useEarlyExits.detail"),
    })
  }
  return { bigO, hotspots, suggestions }
}

function executionFlow(language: Language, code: string) {
  const steps = [
    { title: "Parse", detail: "Read source and tokenize." },
    { title: "Initialize", detail: "Set up variables and functions." },
  ]
  if (/main\s*\(/.test(code) || /def\s+main\s*\(/.test(code)) {
    steps.push({ title: "Enter main", detail: "Program entry point." })
  } else {
    steps.push({ title: "Execute top-level", detail: "Run top-level statements." })
  }
  if (/for\s*\(|while\s*\(|for\s+\w+\s+in/.test(code)) {
    steps.push({ title: "Loop", detail: "Iterate over a sequence or condition." })
  }
  steps.push({ title: "Finish", detail: "Program completes." })
  return { steps }
}

export async function mockAnalyze(language: Language, code: string): Promise<AnalysisResponse> {
  await new Promise((r) => setTimeout(r, 200))
  const syntax = basicSyntaxScan(language, code)
  const quality = qualityChecks(language, code)
  const learning = learningContent(language, code)
  const performance = performanceAnalysis(language, code)
  const execution = executionFlow(language, code)
  return {
    language,
    syntax,
    quality,
    learning,
    performance,
    executionFlow: execution,
    createdAt: new Date().toISOString(),
  }
}


