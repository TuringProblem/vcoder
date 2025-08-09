import * as React from "react"

export function TheorySection({ children }: { children: React.ReactNode }) {
  return <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">{children}</div>
}


