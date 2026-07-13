import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Nav />
      {children}
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
