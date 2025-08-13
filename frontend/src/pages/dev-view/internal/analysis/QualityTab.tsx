import type { AnalysisResponse } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, CheckCircle, ListChecks } from "lucide-react";

export function QualityTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse;
  isLoading?: boolean;
}) {
  const q = data?.quality;
  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Evaluating code quality…
      </div>
    );
  }
  if (!q) return null;
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart2 className="h-4 w-4" /> Score
            <Badge variant="outline">{Math.round(q.score)}/100</Badge>
            <Badge className="capitalize">{q.grade}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Complexity</div>
            <div className="font-medium">{q.complexity.cyclomatic}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Functions</div>
            <div className="font-medium">{q.complexity.functions}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Loops</div>
            <div className="font-medium">{q.complexity.loops}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Lines</div>
            <div className="font-medium">{q.metrics.lines}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="h-4 w-4" /> Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {q.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mt-[2px]" />
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-muted-foreground">{s.detail}</div>
                {s.why && (
                  <div className="text-xs text-muted-foreground">
                    Why: {s.why}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
