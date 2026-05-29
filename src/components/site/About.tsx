import nicholas from "@/assets/nicholas.png";

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-2 md:items-center">
        {/* Photo & name — now first (above on mobile, left on desktop) */}
        <div className="relative">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
            {/* Circle portrait with glowing white stroke */}
            <div className="relative shrink-0">
              <div className="relative h-56 w-56 md:h-64 md:w-64">
                <svg
                  viewBox="0 0 200 200"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  style={{
                    filter:
                      "drop-shadow(0 0 14px rgba(255,255,255,0.45)) drop-shadow(0 0 30px rgba(255,255,255,0.25))",
                  }}
                >
                  <defs>
                    <clipPath id="circle-clip">
                      <circle cx="100" cy="100" r="95" />
                    </clipPath>
                    <linearGradient id="streak-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="white" stopOpacity="0" />
                      <stop offset="50%" stopColor="white" stopOpacity="1" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Inner background + portrait clipped to circle */}
                  <g clipPath="url(#circle-clip)">
                    <rect width="200" height="200" fill="oklch(0.17 0.03 265)" />
                    <image
                      href={nicholas}
                      x="0"
                      y="0"
                      width="200"
                      height="200"
                      preserveAspectRatio="xMidYMin slice"
                    />
                  </g>

                  {/* Base white stroke */}
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill="none"
                    stroke="white"
                    strokeOpacity="0.55"
                    strokeWidth="2.5"
                  />

                  {/* Light streak orbiting the circle */}
                  <g style={{ transformOrigin: "100px 100px", animation: "spin-orbit 3.5s linear infinite" }}>
                    <circle
                      cx="100"
                      cy="100"
                      r="95"
                      fill="none"
                      stroke="url(#streak-grad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="80 560"
                      style={{
                        filter: "drop-shadow(0 0 6px white) drop-shadow(0 0 12px white)",
                      }}
                    />
                  </g>
                </svg>
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

        {/* About the studio text — now second (below on mobile, right on desktop) */}
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
              "Unlimited revisions on premium projects",
              "Hand-crafted by senior designers",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-accent/20 text-accent">✓</span>
                <span className="text-foreground/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
