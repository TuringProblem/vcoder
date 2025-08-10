import { Link } from "react-router-dom"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" data-testid="main-layout">
      <header className="border-b px-4 h-12 flex items-center gap-4">
        <Link to="/" className="font-semibold" data-testid="brand-link">CodeLearn</Link>
        <nav className="ml-auto flex items-center gap-3 text-sm">
          <Link className="underline" to="/course/javascript" data-testid="nav-courses">Courses</Link>
          <Link className="underline" to="/dashboard" data-testid="nav-dashboard">Dashboard</Link>
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t px-4 h-12 flex items-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CodeLearn
      </footer>
    </div>
  )
}


