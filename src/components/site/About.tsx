import nicholas from "@/assets/nicholas.png";

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
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
            {/* Hexagon portrait with glowing white stroke */}
            <div className="relative shrink-0">
              <div
                className="relative h-56 w-56 md:h-64 md:w-64"
                style={{
                  filter:
                    "drop-shadow(0 0 18px rgba(255,255,255,0.55)) drop-shadow(0 0 38px rgba(255,255,255,0.25))",
                }}
              >
                {/* White glowing stroke layer */}
                <div
                  className="absolute inset-0 bg-white"
                  style={{
                    clipPath:
                      "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
                    borderRadius: "18%",
                  }}
                />
                {/* Inner portrait, slightly smaller to reveal the stroke */}
                <div
                  className="absolute inset-[4px] overflow-hidden bg-gradient-to-br from-[oklch(0.22_0.04_265)] to-[oklch(0.15_0.02_265)]"
                  style={{
                    clipPath:
                      "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
                    borderRadius: "16%",
                  }}
                >
                  <img
                    src={nicholas}
                    alt="Nicholas Mwaniki — CEO & Founder of Dosantoz Enterprises"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl font-bold md:text-3xl tracking-tight">
                NICHOLAS MWANIKI
              </h3>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-accent">
                C.E.O | Founder of Dosantoz Enterprises
              </p>
            </div>
          </div>

          <div className="mt-6 hidden rounded-2xl glass p-5 shadow-glow md:inline-block animate-float">
            <div className="text-3xl font-display font-bold text-primary">★ 5.0</div>
            <div className="text-xs text-muted-foreground">Average client rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
