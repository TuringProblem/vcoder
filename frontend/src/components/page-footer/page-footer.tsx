type FooterProps = { footerText: string };

export const Footer = ({ footerText }: FooterProps) => {
  return (
    <footer className="border-t px-4 h-12 flex items-center text-xs text-muted-foreground">
      {footerText}
    </footer>
  );
};
