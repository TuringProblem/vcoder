import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { t } from "@/lib/i18n"

export function NavigationControls({ 
  prev, 
  next,
  onComplete,
  onNext,
  onPrevious,
  isCompleting = false
}: { 
  prev?: string; 
  next?: string;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isCompleting?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        {onPrevious ? (
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
        ) : prev ? (
          <Button asChild variant="outline">
            <Link to={prev}>Previous</Link>
          </Button>
        ) : (
          <span />
        )}
      </div>
      
      <div className="flex gap-2">
        {onComplete && (
          <Button 
            onClick={onComplete}
            disabled={isCompleting}
            data-testid="mark-complete"
          >
            {isCompleting ? "Completing..." : "Mark Complete"}
          </Button>
        )}
        
        {onNext ? (
          <Button onClick={onNext}>
            Next
          </Button>
        ) : next ? (
          <Button asChild>
            <Link to={next}>Next</Link>
          </Button>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}


