import * as React from "react";

export type EditorMode = "standard" | "vim";

const STORAGE_KEY = "code-analyzer.editorMode";

function readStoredMode(): EditorMode {
  const raw =
    typeof window !== "undefined"
      ? window.localStorage.getItem(STORAGE_KEY)
      : null;
  if (raw === "vim" || raw === "standard") return raw;
  return "standard";
}

export function useEditorMode(): [EditorMode, (mode: EditorMode) => void] {
  const [mode, setMode] = React.useState<EditorMode>(readStoredMode);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  }, [mode]);

  return [mode, setMode];
}
