import * as React from 'react'
import { CodeEditor } from '@/components/Editor'
import { analyzeCode, type Feedback } from '@/lib/api'

export function App() {
  const [code, setCode] = React.useState<string>(`function hello(name: string) {\n  console.log('hello', name)\n}`)
  const [feedback, setFeedback] = React.useState<Feedback[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onAnalyze = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await analyzeCode(code)
      setFeedback(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen flex">
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b flex items-center gap-2">
          <h1 className="font-semibold">Code Analyzer</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onAnalyze}
              disabled={loading}
              className="px-3 py-1.5 rounded-md bg-black text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </div>
        </div>
        <div className="flex-1">
          <CodeEditor value={code} onChange={setCode} />
        </div>
        {error && <div className="p-2 text-sm text-red-600 border-t bg-red-50">{error}</div>}
      </div>
      <SidebarContainer feedback={feedback} />
    </div>
  )
}

function SidebarContainer({ feedback }: { feedback: Feedback[] }) {
  return (
    <div className="h-full">
      <div className="h-full">
        <Sidebar feedback={feedback} />
      </div>
    </div>
  )
}

import { Sidebar } from '@/components/Sidebar'
