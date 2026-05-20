const services = [
  { t: "Poster & Flyer Design", d: "Event, club and campaign posters with cinematic typography.", i: "✦" },
  { t: "Brand Identity", d: "Logos, color systems and guidelines for ambitious brands.", i: "◆" },
  { t: "Social Media Design", d: "Scroll-stopping creatives for Instagram, TikTok and X.", i: "◉" },
  { t: "Motion Graphics", d: "Animated logos, reels and product loops that move.", i: "▲" },
  { t: "3D Text & Type", d: "Glossy, metallic, glowing typography rendered for impact.", i: "✺" },
  { t: "Event Branding", d: "End-to-end visuals for concerts, launches and conferences.", i: "✶" },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Services</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Everything visual, <span className="text-gradient">under one roof</span>.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.t}
              className="group relative overflow-hidden rounded-3xl glass p-7 shadow-glow transition hover:-translate-y-1 hover:ring-neon"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[oklch(0.5_0.22_265/0.4)] to-[oklch(0.72_0.18_165/0.4)] opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-2xl text-primary">
                {s.i}
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
