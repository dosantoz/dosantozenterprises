import { SiWhatsapp, SiGmail, SiInstagram, SiTiktok } from "react-icons/si";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="overflow-hidden rounded-3xl glass p-8 shadow-glow md:p-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent">Let's talk</span>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
                Start your <span className="text-gradient">next project</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tell us about your brand, event or campaign. We usually reply within an hour.
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <a href="tel:0706658803" className="flex items-center gap-3 hover:text-primary">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">☎</span>
                  <span>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Phone</div>
                    <div className="font-semibold">0706 658 803</div>
                  </span>
                </a>
                <a
                  href="https://wa.me/254706658803"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/20 text-accent"><SiWhatsapp className="h-5 w-5" /></span>
                  <span>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</div>
                    <div className="font-semibold">0706 658 803</div>
                  </span>
                </a>
                <a href="mailto:dosantozgfx@gmail.com" className="flex items-center gap-3 hover:text-primary">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">✉</span>
                  <span>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                    <div className="font-semibold">dosantozgfx@gmail.com</div>
                  </span>
                </a>
              </div>

              <div className="mt-8 flex gap-3">
                <a
                  href="https://instagram.com/dosantoz_enterprises"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full glass px-4 py-2 text-sm hover:ring-neon"
                >
                  Instagram @dosantoz_enterprises
                </a>
                <a
                  href="https://tiktok.com/@dosantozenterprises"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full glass px-4 py-2 text-sm hover:ring-neon"
                >
                  TikTok @dosantozenterprises
                </a>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = e.currentTarget as HTMLFormElement;
                const name = (f.elements.namedItem("name") as HTMLInputElement).value;
                const msg = (f.elements.namedItem("message") as HTMLTextAreaElement).value;
                window.open(
                  `https://wa.me/254706658803?text=${encodeURIComponent(`Hi Dosantoz, I'm ${name}. ${msg}`)}`,
                  "_blank",
                );
              }}
              className="space-y-4 rounded-2xl border border-border bg-card/40 p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  required
                  placeholder="Your name"
                  className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <input
                name="subject"
                placeholder="Project type (e.g. Event Flyer)"
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us about your project…"
                className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
              >
                Send via WhatsApp →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
