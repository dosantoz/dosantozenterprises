import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSignedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Dosantoz Enterprises" className="h-9 w-auto md:h-10" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full glass px-2 py-1.5 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-white/10 text-foreground" }}
              className="rounded-full px-3.5 py-1.5 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {signedIn ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-semibold hover:ring-neon"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-semibold hover:ring-neon"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/order"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]"
          >
            Start Project
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-full glass md:hidden"
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="mx-5 mt-3 rounded-2xl glass p-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {signedIn ? (
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white/5"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white/5"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/order"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
          >
            Start Project
          </Link>
        </div>
      )}
    </header>
  );
}
