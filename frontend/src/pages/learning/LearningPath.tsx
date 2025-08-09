import { Link, useParams } from "react-router-dom"

const sections = [
  { id: "intro", title: "What is Programming?" },
  { id: "variables", title: "Variables" },
  { id: "conditionals", title: "Conditionals" },
  { id: "loops", title: "Loops" },
  { id: "functions", title: "Functions" },
]

export function LearningPath() {
  const { language = "javascript" } = useParams()
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Course: {language}</h1>
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.id}>
            <Link className="underline" to={`/course/${language}/${s.id}/lesson-1`}>
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


