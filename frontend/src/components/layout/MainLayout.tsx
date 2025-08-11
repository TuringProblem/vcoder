import { Link } from "react-router-dom";
import { UserAvatarMenu } from "@/components/layout/UserAvatarMenu";

const mainHeader = () => {
  return (
    <header className="border-b px-4 h-12 flex items-center gap-4">
      <Link to="/" className="font-semibold" data-testid="brand-link">
        CodeLearn
      </Link>
      <nav className="ml-auto flex items-center gap-3 text-sm">
        <Link
          className="underline"
          to="/course/javascript"
          data-testid="nav-courses"
        >
          Courses
        </Link>
        <UserAvatarMenu />
      </nav>
    </header>
  );
};

const footerText = () => {
  return (
    <footer className="border-t px-4 h-12 flex items-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} CodeLearn
    </footer>
  );
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" data-testid="main-layout">
      {mainHeader()}
      <main className="flex-1">{children}</main>
      {footerText()}
    </div>
  );
}
