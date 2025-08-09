"use client"

export function configureMonaco(monaco: typeof import("monaco-editor")) {
  // Ensure language registrations exist
  monaco.languages.register({ id: "python" })
  monaco.languages.register({ id: "java" })
  // JS/TS defaults and LSP-like features via TS Language Service
  const jsDefaults = monaco.languages.typescript.javascriptDefaults
  const tsDefaults = monaco.languages.typescript.typescriptDefaults

  jsDefaults.setEagerModelSync(true)
  tsDefaults.setEagerModelSync(true)

  const compilerOptions: import("monaco-editor").languages.typescript.CompilerOptions = {
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
    lib: ["es2020", "dom"],
    typeRoots: ["node_modules/@types"],
    strict: true,
    experimentalDecorators: true,
  }

  jsDefaults.setCompilerOptions(compilerOptions)
  tsDefaults.setCompilerOptions(compilerOptions)

  // Diagnostics configuration
  jsDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: false,
  })
  tsDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: false,
  })

  // Optionally preload common lib typings or ambient declarations
  const ambient = `
  declare module "*.json" { const value: any; export default value; }
  `
  jsDefaults.addExtraLib(ambient, "inmemory://model/ambient.json.d.ts")
  tsDefaults.addExtraLib(ambient, "inmemory://model/ambient.json.d.ts")
}
