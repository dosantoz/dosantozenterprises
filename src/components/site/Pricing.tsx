const tiers = [
  {
    name: "CORPORATE DESIGNS",
    price: "KSh 1,000",
    blurb: "Quick single-piece designs.",
    features: ["1\nPoster / Flyer", "2 Revisions", "24h Delivery", "HD JPG"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "CORPORATE DESIGNS",
    price: "KSh 1,000",
    blurb: "Quick single-piece designs.",
    features: ["1\nPoster / Flyer", "2 Revisions", "24h Delivery", "HD JPG"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "KSh 5000",
    price: "KSh 10,000",
    blurb: "For startups and growing brands.",
    features: ["Logo + Identity Kit", "5 Social Templates", "Brand Guidelines", "Unlimited Revisions"],
    cta: "Most Popular",
    highlight: true,
  },
  {
    name: "Studio",
    price: "Custom",
    blurb: "Full event & campaign packages.",
    features: ["Event Branding", "Motion Graphics", "3D Type Designs", "Dedicated Designer"],
    cta: "Book a Call",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Pricing</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Simple, <span className="text-gradient">premium packages</span>.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-8 shadow-glow ${
                t.highlight ? "glass ring-neon" : "glass"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  Popular
                </span>
              )}
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t.name}</div>
              <div className="mt-3 font-display text-4xl font-bold text-gradient">{t.price}</div>
              <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 whitespace-pre-line">
                    <span className="mt-1 text-accent">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  t.highlight
                    ? "bg-primary text-primary-foreground hover:scale-[1.02]"
                    : "glass hover:ring-neon"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
