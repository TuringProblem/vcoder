import * as React from "react"
import type { CodeExerciseProps } from "@/components/lessons/CodeExerciseEmbed"

export type ResourceLink = { label: string; url: string }

export type QuizProps = {
  question: string
  options: { id: string; label: string }[]
  answerId: string
  onSubmit?: (correct: boolean) => void
}

export type LessonTemplateProps = {
  title: string
  language: string
  sections: {
    theory: React.ReactNode
    codeExercise?: CodeExerciseProps
    quiz?: QuizProps
    additionalResources?: ResourceLink[]
  }
}

export function LessonTemplate({ title, language, sections }: LessonTemplateProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <span className="text-xs px-2 py-1 rounded border capitalize">{language}</span>
      </div>
      <section>{sections.theory}</section>
      {sections.codeExercise && (
        <section>
          <CodeExercise {...sections.codeExercise} />
        </section>
      )}
      {sections.quiz && (
        <section>
          <Quiz {...sections.quiz} />
        </section>
      )}
      {sections.additionalResources && sections.additionalResources.length > 0 && (
        <section>
          <h2 className="text-lg font-medium">Further reading</h2>
          <ul className="list-disc list-inside text-sm">
            {sections.additionalResources.map((r) => (
              <li key={r.url}>
                <a className="underline" href={r.url} target="_blank" rel="noreferrer">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function CodeExercise(props: CodeExerciseProps) {
  return <div className="mt-2"><CodeExerciseEmbed {...props} /></div>
}

import { CodeExerciseEmbed } from "@/components/lessons/CodeExerciseEmbed"

function Quiz({ question, options, answerId, onSubmit }: QuizProps) {
  const [selected, setSelected] = React.useState<string | null>(null)
  const correct = selected != null && selected === answerId
  return (
    <div className="space-y-2">
      <div className="font-medium">Quiz</div>
      <div className="text-sm">{question}</div>
      <div className="space-y-1">
        {options.map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm">
            <input type="radio" name="quiz" value={o.id} onChange={() => setSelected(o.id)} /> {o.label}
          </label>
        ))}
      </div>
      <button
        className="px-3 py-1.5 rounded-md bg-black text-white disabled:opacity-50"
        disabled={!selected}
        onClick={() => onSubmit?.(correct)}
      >
        Submit
      </button>
      {selected && (
        <div className={`text-sm ${correct ? "text-green-600" : "text-red-600"}`}>
          {correct ? "Correct!" : "Try again."}
        </div>
      )}
    </div>
  )}


