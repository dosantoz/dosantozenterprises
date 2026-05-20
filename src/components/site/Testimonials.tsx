const items = [
  { n: "Amani K.", r: "Event Organizer", q: "Our concert posters sold out the night. Dosantoz delivered exactly what we pictured — and better." },
  { n: "Brian O.", r: "Founder, Lumen Co.", q: "Top-tier identity work. The brand finally feels worthy of the product we built." },
  { n: "Cynthia W.", r: "Marketing Lead", q: "Social engagement tripled the first month. The creatives are simply on another level." },
];

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Testimonials</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Loved by <span className="text-gradient">brands & creators</span>.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((it) => (
            <figure key={it.n} className="rounded-3xl glass p-7 shadow-glow">
              <div className="text-primary">★★★★★</div>
              <blockquote className="mt-4 text-foreground/90">“{it.q}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display font-bold text-primary-foreground">
                  {it.n[0]}
                </span>
                <span>
                  <div className="font-semibold">{it.n}</div>
                  <div className="text-xs text-muted-foreground">{it.r}</div>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
