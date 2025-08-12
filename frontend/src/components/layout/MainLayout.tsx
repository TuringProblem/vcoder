import { HeaderPage } from "@/components/page-header/header";
import { Footer } from "@/components/page-footer/page-footer";

const FOOTER_TEXT = `© ${new Date().getFullYear()} CodeLearn`;
const HEADER_TITLE = "CodeLearn";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" data-testid="main-layout">
      <HeaderPage title={HEADER_TITLE} />
      <main className="flex-1">{children}</main>
      <Footer footerText={FOOTER_TEXT} />
    </div>
  );
}
