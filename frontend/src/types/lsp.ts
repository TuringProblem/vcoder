export type LspSeverity = 1 | 2 | 3 | 4;

export type LspDiagnostic = {
  message: string;
  severity: LspSeverity;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  source?: string;
  code?: string | number;
};

export type HoverInfo = {
  contentsMarkdown: string;
  range?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
};
