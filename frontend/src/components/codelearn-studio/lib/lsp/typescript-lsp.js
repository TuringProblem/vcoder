"use client";
function toLspDiagnostics(markers) {
    return markers.map((m) => ({
        message: m.message,
        severity: m.severity,
        startLineNumber: m.startLineNumber,
        startColumn: m.startColumn,
        endLineNumber: m.endLineNumber,
        endColumn: m.endColumn,
        source: m.source,
        code: m.code,
    }));
}
function isJsTsModel(model) {
    const id = model?.getLanguageId();
    return id === "javascript" || id === "typescript";
}
export function collectDiagnosticsForModel(monaco, model) {
    if (!isJsTsModel(model))
        return [];
    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
    return toLspDiagnostics(markers);
}
export async function getHoverAt(monaco, editor) {
    const model = editor.getModel();
    if (!isJsTsModel(model) || !model)
        return;
    const pos = editor.getPosition();
    if (!pos)
        return;
    const isTs = model.getLanguageId() === "typescript";
    const workerGetter = isTs
        ? monaco.languages.typescript.getTypeScriptWorker
        : monaco.languages.typescript.getJavaScriptWorker;
    if (!workerGetter)
        return;
    const worker = await workerGetter();
    const client = await worker(model.uri);
    const info = await client.getQuickInfoAtPosition(model.uri.toString(), model.getOffsetAt(pos));
    if (!info)
        return;
    const contentsMarkdown = (info.displayParts?.map((p) => p.text).join("") || "") +
        (info.documentation?.map((d) => d.text).join("")
            ? "\n\n" + info.documentation.map((d) => d.text).join("")
            : "");
    const start = model.getPositionAt(info.textSpan.start);
    const end = model.getPositionAt(info.textSpan.start + info.textSpan.length);
    return {
        contentsMarkdown,
        range: {
            startLineNumber: start.lineNumber,
            startColumn: start.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column,
        },
    };
}
export async function renameSymbolAtCursor(monaco, editor) {
    await editor.getAction("editor.action.rename").run();
}
export async function goToDefinition(monaco, editor) {
    await editor.getAction("editor.action.revealDefinition").run();
}
export async function findReferences(monaco, editor) {
    await editor.getAction("editor.action.referenceSearch.trigger").run();
}
