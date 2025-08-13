import type { AnalysisResponse } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ComplexityDisplayProps = {
  bigO: string;
};

function ComplexityDisplay({ bigO }: ComplexityDisplayProps) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">
        Estimated Complexity
      </span>
      <div className="font-medium">{bigO}</div>
    </div>
  );
}

type PerformanceHotspotProps = {
  hotspot: {
    title: string;
    line: number;
    detail: string;
  };
  index: number;
};

function PerformanceHotspot({ hotspot, index }: PerformanceHotspotProps) {
  return (
    <div key={index} className="flex items-start gap-2">
      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-orange-500" />
      <div>
        <div className="font-medium">{hotspot.title}</div>
        <div className="text-muted-foreground">{hotspot.detail}</div>
      </div>
    </div>
  );
}

type PerformanceHotspotsListProps = {
  hotspots: {
    title: string;
    line: number;
    detail: string;
  }[];
};

function PerformanceHotspotsList({ hotspots }: PerformanceHotspotsListProps) {
  return (
    <>
      {hotspots.map((hotspot, index) => (
        <PerformanceHotspot key={index} hotspot={hotspot} index={index} />
      ))}
    </>
  );
}

type PerformanceSuggestionProps = {
  suggestion: {
    title: string;
    detail: string;
  };
  index: number;
};

function PerformanceSuggestion({
  suggestion,
  index,
}: PerformanceSuggestionProps) {
  return (
    <div key={index} className="text-muted-foreground">
      {suggestion.title}: {suggestion.detail}
    </div>
  );
}

type PerformanceSuggestionsListProps = {
  suggestions: {
    title: string;
    detail: string;
  }[];
};

function PerformanceSuggestionsList({
  suggestions,
}: PerformanceSuggestionsListProps) {
  return (
    <>
      {suggestions.map((suggestion, index) => (
        <PerformanceSuggestion
          key={index}
          suggestion={suggestion}
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
  return <div className="text-sm text-muted-foreground">{message}</div>;
}

export function PerformanceTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <LoadingState message="Analyzing performance…" />;
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <ComplexityDisplay bigO={data.performance.bigO} />
        <PerformanceHotspotsList hotspots={data.performance.hotspots} />
        <PerformanceSuggestionsList
          suggestions={data.performance.suggestions}
        />
      </CardContent>
    </Card>
  );
}
