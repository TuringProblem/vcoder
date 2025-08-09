"use client"

import { useEffect, useRef, useState } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import type * as monacoType from "monaco-editor"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wand2, Wrench, LocateFixed, ScanSearch } from "lucide-react"

// Localized store and lib for the embedded editor
import { useEditorStore } from "@/components/codelearn-studio/store"
import { configureMonaco } from "@/components/codelearn-studio/lib/monaco-config"
import { useLspDiagnosticsSync, useHoverSync } from "@/components/codelearn-studio/hooks/use-lsp"
import { goToDefinition, findReferences, renameSymbolAtCursor } from "@/components/codelearn-studio/lib/lsp/typescript-lsp"
import type { Language } from "@/components/codelearn-studio/internal/types/analysis"

const MODEL_URIS: Record<Language, string> = {
  javascript: "inmemory://model/index.js",
  typescript: "inmemory://model/index.ts",
  python: "inmemory://model/main.py",
  java: "inmemory://model/Main.java",
}

export function MonacoEditor() {
  const language = useEditorStore((s) => s.language)
  const code = useEditorStore((s) => s.codeByLanguage[language] || "")
  const setCode = useEditorStore((s) => s.setCodeForLanguage)
  const mode = useEditorStore((s) => s.editorMode)
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null)
  const modelsRef = useRef<Record<Language, monacoType.editor.ITextModel | null>>({
    javascript: null,
    typescript: null,
    python: null,
    java: null,
  })
  const [ready, setReady] = useState(false)

  useLspDiagnosticsSync()
  useHoverSync()

  const ensureModels = (monaco: typeof import("monaco-editor")) => {
    const state = useEditorStore.getState()
    ;(Object.keys(MODEL_URIS) as Language[]).forEach((lang) => {
      if (!modelsRef.current[lang]) {
        const existing = monaco.editor.getModels().find((m) => m.uri.toString() === MODEL_URIS[lang]) ?? null
        if (existing) {
          modelsRef.current[lang] = existing
        } else {
          const languageId = lang === "javascript" ? "javascript" : lang === "typescript" ? "typescript" : lang
          const model = monaco.editor.createModel(
            state.codeByLanguage[lang] ?? "",
            languageId,
            monaco.Uri.parse(MODEL_URIS[lang]),
          )
          modelsRef.current[lang] = model
        }
      }
    })
  }

  const onMount: OnMount = async (editor, monaco) => {
    editorRef.current = editor
    useEditorStore.getState().setEditorInstance(editor)
    configureMonaco(monaco)
    ensureModels(monaco)
    const model = modelsRef.current[language]
    if (model) editor.setModel(model)
    setReady(true)
  }

  useEffect(() => {
    if (!editorRef.current) return
    if (mode === "vim") {
      // Lazy-load vim mode to reduce initial bundle
      import("@/components/codelearn-studio/lib/vim-config").then(({ initVim }) => initVim(editorRef.current!))
    } else {
      import("@/components/codelearn-studio/lib/vim-config").then(({ disposeVim }) => disposeVim())
    }
  }, [mode])

  useEffect(() => {
    const monaco = (window as any).monaco as typeof import("monaco-editor")
    if (!monaco || !editorRef.current) return
    ensureModels(monaco)
    const model = modelsRef.current[language]
    if (model && editorRef.current.getModel() !== model) {
      editorRef.current.setModel(model)
    }
  }, [language])

  useEffect(() => {
    const e = editorRef.current
    const monaco = (window as any).monaco as typeof import("monaco-editor")
    if (!e || !monaco) return
    const model = e.getModel()
    if (model && model.getValue() !== code) {
      model.pushEditOperations([], [{ range: model.getFullModelRange(), text: code }], () => null)
    }
  }, [code])

  const handleQuickFix = async () => {
    const ed = editorRef.current as any
    if (ed) {
      try {
        await ed.getAction("editor.action.quickFix").run()
      } catch {}
    }
  }

  const isLspOn = language === "javascript" || language === "typescript"

  const monacoToolbar = (
    <div className="absolute right-3 top-3 z-10 flex gap-1">
      <div
        className={`px-2 py-1 rounded-md text-xs border ${
          isLspOn ? "border-green-500 text-green-600 dark:text-green-400" : "border-yellow-500 text-yellow-600 dark:text-yellow-400"
        } bg-background/70 backdrop-blur`}
        aria-label={`Language service ${isLspOn ? "on" : "off"}`}
        title={isLspOn ? "LSP features enabled (JS/TS)" : "Basic syntax only. Add an external LSP to enable IDE features."}
      >
        {isLspOn ? "LSP: On" : "LSP: Off"}
      </div>
      <Button size="icon" variant="secondary" aria-label="Quick fix (code actions)" onClick={handleQuickFix} disabled={!isLspOn}>
        <Wrench className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        aria-label="Rename symbol"
        onClick={() => {
          const monaco = (window as any).monaco as typeof import("monaco-editor")
          if (monaco && editorRef.current) renameSymbolAtCursor(monaco, editorRef.current)
        }}
        disabled={!isLspOn}
      >
        <Wand2 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        aria-label="Go to definition"
        onClick={() => {
          const monaco = (window as any).monaco as typeof import("monaco-editor")
          if (monaco && editorRef.current) goToDefinition(monaco, editorRef.current)
        }}
        disabled={!isLspOn}
      >
        <LocateFixed className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        aria-label="Find references"
        onClick={() => {
          const monaco = (window as any).monaco as typeof import("monaco-editor")
          if (monaco && editorRef.current) findReferences(monaco, editorRef.current)
        }}
        disabled={!isLspOn}
      >
        <ScanSearch className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <Card className="relative rounded-none md:rounded-md h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
      {monacoToolbar}
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme="vs-dark"
        value={code}
        loading={<div className="p-4 text-sm text-muted-foreground">Loading editor…</div>}
        onMount={onMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          quickSuggestions: { other: true, comments: false, strings: true },
          suggestOnTriggerCharacters: true,
          renderLineHighlight: "line",
          renderValidationDecorations: "on",
          lineNumbers: "on",
          smoothScrolling: true,
          suggest: {
            preview: true,
            showMethods: true,
            showFunctions: true,
            showVariables: true,
            showClasses: true,
            showConstants: true,
          },
          hover: { enabled: true },
          contextmenu: true,
        }}
        onChange={(val) => setCode(language, val ?? "")}
      />
      {!ready ? null : null}
    </Card>
  )
}


