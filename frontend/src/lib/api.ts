export type AnalyzeRequest = { code: string }
export type Feedback = {
  id: string
  severity: 'info' | 'warning' | 'error'
  message: string
  line: number
  column: number
}

export async function analyzeCode(code: string): Promise<Feedback[]> {
  const res = await fetch('http://localhost:8080/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code } satisfies AnalyzeRequest),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Analyze failed: ${res.status} ${text}`)
  }
  return (await res.json()) as Feedback[]
}
