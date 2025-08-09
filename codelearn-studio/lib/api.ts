"use client"

import type { AnalysisResponse, Language, Severity } from "@/types/analysis"

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
  return \`Hello, \${p.name} (#\${p.id})\`;
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

  // Generic checks
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
          // not all lines need semis; this is a soft warning
          // keep it as info for TS/JS
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
      title: "Consider simplifying loops",
      detail: "Too many loops can indicate complex logic. Extract helper functions.",
      why: "Lower cyclomatic complexity improves readability and testability.",
    })
  }
  if (language === "javascript" && /var\s+/.test(code)) {
    suggestions.push({
      title: "Prefer let/const over var",
      detail: "Use block-scoped declarations.",
      why: "Avoids hoisting pitfalls and improves maintainability.",
    })
    score -= 5
  }
  if (language === "typescript" && !/:/.test(code.split("\n").slice(0, 50).join("\n"))) {
    suggestions.push({
      title: "Add explicit type annotations",
      detail: "Annotate function parameters and return types for clarity.",
      why: "Improves readability and helps the compiler catch errors.",
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

  const grade = score >= 80 ? "good" : score >= 60 ? "ok" : "poor"

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

  if (language === "javascript" && /for\s*$$.*of.*$$/.test(code) === false && /for\s*\(/.test(code)) {
    topics.push({
      title: "for…of loops",
      explanation: "You can iterate arrays and iterables with for…of, which is often clearer than index-based loops.",
      example: `const arr = [1,2,3]\nfor (const n of arr) {\n  console.log(n)\n}`,
      links: [
        {
          label: "MDN: for...of",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of",
        },
      ],
    })
  }

  if (language === "typescript") {
    topics.push({
      title: "Interfaces vs Types",
      explanation:
        "Interfaces and type aliases are similar. Interfaces are extendable and great for object shapes; type aliases can compose unions/intersections.",
      example: `interface User { id: number; name: string }\ntype Id = number | string\n`,
      links: [
        { label: "TS Handbook: Interfaces", url: "https://www.typescriptlang.org/docs/handbook/interfaces.html" },
      ],
    })
    topics.push({
      title: "Generics",
      explanation: "Generics let you write reusable components with type parameters.",
      example: `function identity<T>(arg: T): T { return arg }\nconst n = identity<number>(42)`,
      links: [{ label: "TS Handbook: Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }],
    })
  }

  if (language === "python" && /range\(/.test(code)) {
    topics.push({
      title: "for-each style loops",
      explanation: "In Python, you can iterate directly over items instead of indices when possible.",
      example: `names = ["Ana", "Bo"]\nfor name in names:\n    print(name)`,
      links: [{ label: "Python for loops", url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements" }],
    })
  }

  if (language === "java" && /for\s*$$/.test(code) && !/for\s*\(\s*:\s*$$/.test(code)) {
    topics.push({
      title: "Enhanced for-each loop",
      explanation: "Use the enhanced for loop for iterating collections/arrays when you don't need the index.",
      example: `for (String name : names) {\n    System.out.println(name);\n}`,
      links: [
        {
          label: "Oracle: Enhanced for",
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
  const bigO = nestedLoops > 0 ? "O(n^2)" : loops > 0 ? "O(n)" : "O(1)"
  const hotspots = []
  if (nestedLoops > 0) {
    hotspots.push({ title: "Nested loops", line: 1, detail: "Consider reducing nesting." })
  }
  const suggestions = []
  if (bigO !== "O(1)") {
    suggestions.push({
      title: "Use early exits",
      detail: "Break/return early when goal is reached to reduce iterations.",
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
