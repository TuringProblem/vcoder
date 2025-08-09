"use client"

// JS reuses the same TS language service functions in Monaco (javascriptDefaults)
// This module is here for future extensibility (external LSPs).
export { getHoverAt, renameSymbolAtCursor, goToDefinition, findReferences, collectDiagnostics } from "./typescript-lsp"
