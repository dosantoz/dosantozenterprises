const items = [
  { 
    n: "Headboy Adventures", 
    r: "No. 1 Event/Trip Organizer", 
    q: "Our Road trip posters sold out the night. Dosantoz Enterprises delivered exactly what we pictured — and better.",
    initials: "HA"
  },
  { 
    n: "Brian O.", 
    r: "Founder, Lumen Co.", 
    q: "Top-tier identity work. The brand finally feels worthy of the product we built.",
    initials: "B"
  },
  { 
    n: "Mc. Prince Chak", 
    r: "M.c & Hype Master", 
    q: "Social engagement and bookings tripled the first month. Their creative touch is  simply on another level.",
    initials: "PC"
  },
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
                  {it.initials}
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
