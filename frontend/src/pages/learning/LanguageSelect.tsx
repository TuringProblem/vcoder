import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LanguageList } from "@/data/types/languages.const"

export function LanguageSelect() {
  const navigate = useNavigate()
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Choose a language</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(LanguageList).map(([key, label]) => (
          <Button key={key} variant="outline" onClick={() => navigate(`/course/${key}`)}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}


