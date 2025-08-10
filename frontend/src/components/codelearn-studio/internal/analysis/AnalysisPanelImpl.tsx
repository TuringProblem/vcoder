"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEditorStore } from "@/components/codelearn-studio/store"
import { useCodeAnalysis } from "@/components/codelearn-studio/hooks/use-code-analysis"
import { SyntaxTab } from "@/components/codelearn-studio/internal/analysis/SyntaxTab"
import { QualityTab } from "@/components/codelearn-studio/internal/analysis/QualityTab"
import { LearningTab } from "@/components/codelearn-studio/internal/analysis/LearningTab"
import { ExecutionTab } from "@/components/codelearn-studio/internal/analysis/ExecutionTab"
import { PerformanceTab } from "@/components/codelearn-studio/internal/analysis/PerformanceTab"
import { t } from "@/lib/i18n"

export function AnalysisPanel({
  lessonContext,
}: {
  lessonContext?: {
    language: string;
    section: string;
    lesson: string;
  };
}) {
  const language = useEditorStore((s) => s.language)
  const code = useEditorStore((s) => s.codeByLanguage[language] || "")
  const { data, isLoading, error } = useCodeAnalysis(language, code)

  const grade = (data?.quality?.grade as "good" | "ok" | "poor" | undefined) ?? ("ok" as const)
  const gradeColor = grade === "good" ? "bg-green-500" : grade === "ok" ? "bg-yellow-500" : "bg-red-500"

  return (
    <Card className="rounded-none md:rounded-md h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${gradeColor}`} aria-hidden="true" />
          <span className="text-sm font-medium">{t("analysis.realTimeAnalysis")}</span>
          <Separator orientation="vertical" className="mx-2 h-5" />
          <Badge variant="outline" className="text-xs">
            {language}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {isLoading ? t("analysis.analyzing") : error ? t("analysis.errorAnalyzing") : t("analysis.upToDate")}
        </div>
      </div>
      <div className="p-0 md:p-3 overflow-hidden flex-1 flex flex-col">
        <Tabs defaultValue="syntax" className="flex-1 flex flex-col">
          <div className="px-3 pt-3">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="syntax">{t("analysis.tabs.syntax")}</TabsTrigger>
              <TabsTrigger value="quality">{t("analysis.tabs.quality")}</TabsTrigger>
              <TabsTrigger value="execution">{t("analysis.tabs.execution")}</TabsTrigger>
              <TabsTrigger value="learning">{t("analysis.tabs.learning")}</TabsTrigger>
              <TabsTrigger value="performance">{t("analysis.tabs.performance")}</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-auto">
            <TabsContent value="syntax" className="p-3">
              <SyntaxTab data={data} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="quality" className="p-3">
              <QualityTab data={data} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="execution" className="p-3">
              <ExecutionTab data={data} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="learning" className="p-3">
              <LearningTab data={data} isLoading={isLoading} lessonContext={lessonContext} />
            </TabsContent>
            <TabsContent value="performance" className="p-3">
              <PerformanceTab data={data} isLoading={isLoading} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  )
}


