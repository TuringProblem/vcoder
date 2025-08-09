"use client"

import type * as monacoType from "monaco-editor"
import type { HoverInfo, LspDiagnostic } from "@/components/codelearn-studio/internal/types/lsp"

function toLspDiagnostics(markers: monacoType.editor.IMarkerData[]): LspDiagnostic[] {
  return markers.map((m) => ({
    message: m.message,
    severity: m.severity as any,
    startLineNumber: m.startLineNumber,
    startColumn: m.startColumn,
    endLineNumber: m.endLineNumber,
    endColumn: m.endColumn,
    source: m.source,
    code: m.code as any,
  }))
}

function isJsTsModel(model?: monacoType.editor.ITextModel | null) {
  const id = model?.getLanguageId()
  return id === "javascript" || id === "typescript"
}

export function collectDiagnosticsForModel(
  monaco: typeof import("monaco-editor"),
  model: monacoType.editor.ITextModel,
): LspDiagnostic[] {
  if (!isJsTsModel(model)) return []
  const markers = monaco.editor.getModelMarkers({ resource: model.uri })
  return toLspDiagnostics(markers)
}

export async function getHoverAt(
  monaco: typeof import("monaco-editor"),
  editor: monacoType.editor.IStandaloneCodeEditor,
): Promise<HoverInfo | undefined> {
  const model = editor.getModel()
  if (!isJsTsModel(model) || !model) return
  const pos = editor.getPosition()
  if (!pos) return
  const isTs = model.getLanguageId() === "typescript"
  const workerGetter = isTs
    ? (monaco.languages.typescript as any).getTypeScriptWorker
    : (monaco.languages.typescript as any).getJavaScriptWorker
  if (!workerGetter) return
  const worker = await workerGetter()
  const client = await worker(model.uri)
  const info = await client.getQuickInfoAtPosition(model.uri.toString(), model.getOffsetAt(pos))
  if (!info) return
  const contentsMarkdown =
    (info.displayParts?.map((p: any) => p.text).join("") || "") +
    (info.documentation?.map((d: any) => d.text).join("")
      ? "\n\n" + info.documentation.map((d: any) => d.text).join("")
      : "")
  const start = model.getPositionAt(info.textSpan.start)
  const end = model.getPositionAt(info.textSpan.start + info.textSpan.length)
  return {
    contentsMarkdown,
    range: {
      startLineNumber: start.lineNumber,
      startColumn: start.column,
      endLineNumber: end.lineNumber,
      endColumn: end.column,
    },
  }
}

export async function renameSymbolAtCursor(
  monaco: typeof import("monaco-editor"),
  editor: monacoType.editor.IStandaloneCodeEditor,
) {
  await (editor as any).getAction("editor.action.rename").run()
}

export async function goToDefinition(
  monaco: typeof import("monaco-editor"),
  editor: monacoType.editor.IStandaloneCodeEditor,
) {
  await (editor as any).getAction("editor.action.revealDefinition").run()
}

export async function findReferences(
  monaco: typeof import("monaco-editor"),
  editor: monacoType.editor.IStandaloneCodeEditor,
) {
  await (editor as any).getAction("editor.action.referenceSearch.trigger").run()
}


