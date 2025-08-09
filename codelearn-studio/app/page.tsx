"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useMemo } from "react"

export default function Page() {
  const [client] = useState(() => new QueryClient())
  const key = useMemo(() => ({ k: "ql" }), [])
  return (
    <QueryClientProvider client={client} key={key.k}>
      <MainLayout />
    </QueryClientProvider>
  )
}
