import { Badge } from "@/components/ui/badge"

export function LanguageBadge({ language }: { language: string }) {
  return <Badge variant="outline" className="capitalize">{language}</Badge>
}


