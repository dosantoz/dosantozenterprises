import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <img
        src={heroBg}
        alt=""
        aria-hidden
        width={1920}
        height={1280}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 -z-10 bg-hero" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background" />

      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-glow" />
            World-class creative studio
          </span>

          <h1 className="mt-7 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl animate-fade-in">
            Creative <span className="text-gradient">Graphic Design</span><br />
            Solutions
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-in">
            Posters • Branding • Motion Graphics • Social Media Designs • Event Flyers • 3D Text Designs
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]"
            >
              View Portfolio →
            </a>
            <a
              href="https://wa.me/254706658803"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition hover:ring-neon"
            >
              Start a Project
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ["120+", "Projects"],
            ["80+", "Happy Clients"],
            ["5y", "Experience"],
            ["24/7", "Support"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl glass p-5 text-center shadow-glow">
              <div className="font-display text-3xl font-bold text-gradient">{k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
