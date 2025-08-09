"use client"

import { Code, Keyboard, Sparkles } from "lucide-react"
import { LanguageSelector } from "@/components/editor/language-selector"
import { EditorModeSelector } from "@/components/editor/editor-mode-selector"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEditorStore } from "@/store/editor-store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const vimStatus = useEditorStore((s) => s.vimStatus)
  const theme = useEditorStore((s) => s.theme)
  const setTheme = useEditorStore((s) => s.setTheme)
  const lang = useEditorStore((s) => s.language)
  const isLspOn = lang === "javascript" || lang === "typescript"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/70 backdrop-blur">
      <div className="mx-auto flex h-14 items-center justify-between px-3 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="font-semibold">CodeLearn Studio</span>
          </div>
          <Separator orientation="vertical" className="mx-3 h-6" />
          <EditorModeSelector />
          <Separator orientation="vertical" className="mx-3 h-6 hidden md:block" />
          <div className="hidden md:flex">
            <LanguageSelector />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="hidden sm:flex items-center gap-1 text-xs rounded-md border border-border px-2 py-1"
                  aria-live="polite"
                  aria-label="Vim mode status"
                >
                  <Keyboard className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{vimStatus || "—"}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Vim status (normal/insert/visual)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={isLspOn ? "default" : "secondary"} className="text-xs cursor-default">
                  {isLspOn ? "LSP: On" : "LSP: Off"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {isLspOn
                  ? "Language service features enabled (JS/TS)."
                  : "Only syntax highlighting. Integrate an external LSP for full IDE features."}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle theme"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Code className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Code className="h-5 w-5" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="md:hidden px-3 pb-2">
        <LanguageSelector />
      </div>
    </header>
  )
}
