"use client";

import type { AnalysisResponse } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ExecutionStepProps = {
  step: {
    title: string;
    detail: string;
  };
  index: number;
};

function ExecutionStep({ step, index }: ExecutionStepProps) {
  return (
    <div key={index} className="flex items-start gap-2">
      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-foreground" />
      <div>
        <div className="font-medium">{step.title}</div>
        <div className="text-muted-foreground">{step.detail}</div>
      </div>
    </div>
  );
}

type ExecutionStepsListProps = {
  steps: {
    title: string;
    detail: string;
  }[];
};

function ExecutionStepsList({ steps }: ExecutionStepsListProps) {
  return (
    <>
      {steps.map((step, index) => (
        <ExecutionStep key={index} step={step} index={index} />
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

export function ExecutionTab({
  data,
  isLoading,
}: {
  data?: AnalysisResponse;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <LoadingState message="Tracing execution…" />;
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Execution Flow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <ExecutionStepsList steps={data.executionFlow.steps} />
      </CardContent>
    </Card>
  );
}
