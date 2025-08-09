"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, Keyboard, Sparkles } from "lucide-react"

export function WelcomeDialog() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const k = "cls-welcome-shown"
    const shown = typeof window !== "undefined" ? localStorage.getItem(k) : "1"
    if (!shown) {
      setOpen(true)
      localStorage.setItem(k, "1")
    }
  }, [])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Welcome to CodeLearn Studio
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Learn by doing. Type code on the left and see friendly, real-time feedback on the right.
          </p>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">Beginner-friendly tips</div>
              <div className="text-muted-foreground">
                Clear explanations and suggestions help you improve step-by-step.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Keyboard className="h-4 w-4 text-blue-500 mt-0.5" />
            <div>
              <div className="font-medium">Vim motions</div>
              <div className="text-muted-foreground">Prefer Vim? Toggle it in the header.</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
