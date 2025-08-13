import type { AnalysisResponse } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Info,
  OctagonAlert,
  TriangleAlert,
  Wand2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProblemsPanel } from "@/pages/dev-view/internal/analysis/problems-panel";
import { useEditorStore } from "@/pages/dev-view/store";

type SyntaxIssueProps = {
  issue: {
    line: number;
    severity: "error" | "warning" | "info";
    message: string;
    quickFix?: string;
    explanation?: string;
  };
  index: number;
};

function SyntaxIssue({ issue, index }: SyntaxIssueProps) {
  const getSeverityIcon = () => {
    switch (issue.severity) {
      case "error":
        return <OctagonAlert className="h-4 w-4 text-red-500 mt-0.5" />;
      case "warning":
        return <TriangleAlert className="h-4 w-4 text-yellow-500 mt-0.5" />;
      default:
        return <Info className="h-4 w-4 text-blue-500 mt-0.5" />;
    }
  };

  return (
    <Card key={`${issue.message}-${index}`}>
      <CardContent className="py-3 flex items-start gap-3">
        {getSeverityIcon()}
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">{issue.message}</span>
            <Badge variant="outline">Line {issue.line}</Badge>
            <Badge variant="secondary" className="capitalize">
              {issue.severity}
            </Badge>
          </div>
          {issue.quickFix && (
            <div className="text-muted-foreground">{issue.quickFix}</div>
          )}
          {issue.explanation && (
            <div className="text-muted-foreground text-xs">
              {issue.explanation}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type SyntaxIssuesListProps = {
  issues: {
    line: number;
    severity: "error" | "warning" | "info";
    message: string;
    quickFix?: string;
    explanation?: string;
  }[];
};

function SyntaxIssuesList({ issues }: SyntaxIssuesListProps) {
  if (issues.length === 0) {
    return (
      <div className="text-sm flex items-center gap-2">
        <Wand2 className="h-4 w-4" />
        Looks good! No syntax issues detected by the mock analyzer.
      </div>
    );
  }

  return (
    <>
      {issues.map((issue, index) => (
        <SyntaxIssue
          key={`${issue.message}-${index}`}
          issue={issue}
          index={index}
        />
      ))}
    </>
  );
}

type LoadingStateProps = {
  message: string;
};

function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {message}
    </div>
  );
}

type EmptyStateProps = {
  message: string;
};

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-sm text-muted-foreground flex items-center gap-2">
      <Info className="h-4 w-4" />
      {message}
    </div>
  );
}

export function SyntaxTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse;
  isLoading?: boolean;
}) {
  const lsp = useEditorStore((s) => s.lspDiagnostics);

  if (isLoading) {
    return <LoadingState message="Analyzing syntax…" />;
  }

  const syntax = data?.syntax;
  if (!syntax) {
    return <EmptyState message="Start typing to see syntax feedback." />;
  }

  return (
    <div className="space-y-3">
      <SyntaxIssuesList issues={syntax.issues} />
      <ProblemsPanel diagnostics={lsp} />
    </div>
  );
}
