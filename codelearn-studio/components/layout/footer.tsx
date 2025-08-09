"use client"

import { Button } from "@/components/ui/button"
import { Save, Download, Upload, FileCode, Play } from "lucide-react"
import { useEditorStore } from "@/store/editor-store"
import { Progress } from "@/components/ui/progress"
import { useCodeAnalysis } from "@/hooks/use-code-analysis"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Footer() {
  const language = useEditorStore((s) => s.language)
  const code = useEditorStore((s) => s.codeByLanguage[language] || "")
  const setTemplateForLanguage = useEditorStore((s) => s.setTemplateForLanguage)
  const saveCurrent = useEditorStore((s) => s.saveCurrent)
  const loadSaved = useEditorStore((s) => s.loadSaved)
  const exportCode = useEditorStore((s) => s.exportCode)
  const exportReport = useEditorStore((s) => s.exportReport)
  const formatDocument = useEditorStore((s) => s.formatDocument)

  const { data } = useCodeAnalysis(language, code)
  const score = data?.quality?.score ?? 0

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex flex-col md:flex-row gap-2 items-center justify-between px-3 md:px-6 py-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setTemplateForLanguage(language)}>
            <FileCode className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" onClick={saveCurrent}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save code locally for this language</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" size="sm" onClick={loadSaved}>
            <Upload className="h-4 w-4 mr-2" />
            Load
          </Button>
          <Button variant="ghost" size="sm" onClick={() => exportCode()}>
            <Download className="h-4 w-4 mr-2" />
            Export Code
          </Button>
          <Button variant="ghost" size="sm" onClick={() => exportReport()}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <Button variant="outline" size="sm" onClick={() => formatDocument()}>
            <Play className="h-4 w-4 mr-2" />
            Format
          </Button>
        </div>
        <div className="flex items-center gap-3 w-full md:w-72">
          <div className="text-xs text-muted-foreground w-16">Quality</div>
          <Progress value={score} aria-label="Code quality score" />
          <div className="text-xs w-8 text-right">{Math.round(score)}</div>
        </div>
      </div>
    </footer>
  )
}
