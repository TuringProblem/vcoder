import Editor, { OnMount, type EditorProps as MonacoEditorProps } from '@monaco-editor/react'
import * as React from 'react'
import type * as monacoNs from 'monaco-editor'

type VimMode = {
  dispose: () => void
}

type MonacoVimAPI = {
  VimMode: new (editor: monacoNs.editor.IStandaloneCodeEditor, statusBar?: HTMLElement | null) => VimMode
}

export type CodeEditorProps = {
  value: string
  onChange: (val: string) => void
  language?: string
  mode?: 'standard' | 'vim'
  className?: string
  statusBarRef?: React.RefObject<HTMLDivElement>
}

export function CodeEditor({ value, onChange, language = 'typescript', mode = 'standard', className, statusBarRef }: CodeEditorProps) {
  const handleChange = (val?: string) => onChange(val ?? '')
  const vimInstanceRef = React.useRef<VimMode | null>(null)
  const editorRef = React.useRef<monacoNs.editor.IStandaloneCodeEditor | null>(null)

  const handleMount: OnMount = async (editor) => {
    editorRef.current = editor
    editor.focus()
  }

  // Toggle vim dynamically when mode changes
  React.useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    let cancelled = false

    const enableVim = async () => {
      if (vimInstanceRef.current) return
      const mod: MonacoVimAPI = await import('monaco-vim') as unknown as MonacoVimAPI
      if (cancelled) return
      vimInstanceRef.current = new mod.VimMode(editor, statusBarRef?.current ?? null)
    }

    if (mode === 'vim') {
      enableVim()
    } else {
      // disable vim
      if (vimInstanceRef.current) {
        vimInstanceRef.current.dispose()
        vimInstanceRef.current = null
      }
    }

    return () => {
      cancelled = true
    }
  }, [mode, statusBarRef])

  return (
    <div className={"h-full w-full border rounded-md overflow-hidden " + (className ?? '')}>
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
