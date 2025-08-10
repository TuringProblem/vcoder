import * as React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Dashboard } from "@/pages/dashboard/Dashboard"
import { Profile } from "@/pages/dashboard/Profile"
import { LearningPath } from "@/pages/learning/LearningPath"
import { LessonPage } from "@/pages/learning/LessonPage"
import { MainLayout } from "@/components/layout/MainLayout"

const qc = new QueryClient()

export function AppRouter() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/course/javascript" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/course/:language" element={<LearningPath />} />
            <Route path="/course/:language/:section/:lesson" element={<LessonPage />} />
            <Route path="/code-practice/:language" element={<LessonPage isPractice />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}


