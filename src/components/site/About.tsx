import logo from "@/assets/logo.png";

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-accent">About the studio</span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Design that <span className="text-gradient">feels cinematic</span>.
          </h2>
          <p className="mt-5 text-muted-foreground md:text-lg">
            DOSANTOZ ENTERPRISES is a creative graphic design studio crafting bold visual
            identities for ambitious brands across Africa and beyond. We blend modern
            typography, dimensional lighting and editorial precision to make work that
            stops the scroll — and starts conversations.
          </p>
          <ul className="mt-7 grid gap-3 text-sm">
            {[
              "Strategy-led concepts before every pixel",
              "Premium delivery in 24–72 hours",
              "Unlimited revisions on every project",
              "Hand-crafted by senior designers",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-accent/20 text-accent">✓</span>
                <span className="text-foreground/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass shadow-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.5_0.22_265/0.6)] via-transparent to-[oklch(0.72_0.18_165/0.5)]" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <img src={logo} alt="Dosantoz Enterprises" className="h-28 w-auto md:h-36" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl glass p-5 shadow-glow md:block animate-float">
            <div className="text-3xl font-display font-bold text-primary">★ 5.0</div>
            <div className="text-xs text-muted-foreground">Average client rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
