import Editor, { OnMount } from '@monaco-editor/react'
import * as React from 'react'

export type CodeEditorProps = {
  value: string
  onChange: (val: string) => void
  language?: string
}

export function CodeEditor({ value, onChange, language = 'typescript' }: CodeEditorProps) {
  const handleChange = (val?: string) => onChange(val ?? '')
  const handleMount: OnMount = (editor) => {
    editor.focus()
  }

  return (
    <div className="h-full w-full border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={handleChange}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  )
}
