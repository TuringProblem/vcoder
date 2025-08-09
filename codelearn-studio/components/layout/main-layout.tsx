"use client"

import { Header } from "./header"
import { Footer } from "./footer"
import { MonacoEditor } from "@/components/editor/monaco-editor"
import { AnalysisPanel } from "@/components/analysis/analysis-panel"
import { useEditorStore } from "@/store/editor-store"
import { WelcomeDialog } from "@/components/welcome/welcome-dialog"

export function MainLayout() {
  const theme = useEditorStore((s) => s.theme)
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Header />
        <main className="flex flex-col md:flex-row gap-0 md:gap-4 px-3 md:px-6 pb-24">
          <section
            aria-label="Code editor"
            className="w-full md:w-[60%] border-b md:border-b-0 md:border-r border-border"
          >
            <MonacoEditor />
          </section>
          <section aria-label="Analysis panel" className="w-full md:w-[40%]">
            <AnalysisPanel />
          </section>
        </main>
        <Footer />
        <WelcomeDialog />
      </div>
    </div>
  )
}
