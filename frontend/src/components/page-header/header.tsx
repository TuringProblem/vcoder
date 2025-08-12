import { Link } from "react-router-dom";
import { UserAvatarMenu } from "@/components/layout/UserAvatarMenu";

type HeaderProps = {
  title: string;
};

export const HeaderPage = ({ title }: HeaderProps) => {
  return (
    <header className="border-b px-4 h-12 flex items-center gap-4">
      <Link to="/" className="font-semibold" data-testid="brand-link">
        {title}
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
