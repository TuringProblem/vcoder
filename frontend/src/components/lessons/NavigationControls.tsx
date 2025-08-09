import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NavigationControls({ prev, next }: { prev?: string; next?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>{prev ? <Button asChild variant="outline"><Link to={prev}>Previous</Link></Button> : <span />}</div>
      <div>{next ? <Button asChild><Link to={next}>Next</Link></Button> : <span />}</div>
    </div>
  )
}


