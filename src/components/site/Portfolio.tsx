import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import w1 from "@/assets/work-1.jpg";
import w2 from "@/assets/work-2.jpg";
import w3 from "@/assets/work-3.jpg";
import w4 from "@/assets/work-4.jpg";
import w5 from "@/assets/work-5.jpg";
import w6 from "@/assets/work-6.jpg";
import w7 from "@/assets/work-7.jpg";

const works = [
  { img: w1, title: "ROAD TRIPS", tag: "ONLINE POSTERS" },
  { img: w2, title: "ROAD TRIP POSTERS", tag: "ONLINE POSTERS" },
  { img: w3, title: "CHARITY POSTERS", tag: "ONLINE POSTERS" },
  { img: w4, title: "CLUB POSTERS", tag: "ONLINE POSTERS" },
  { img: w5, title: "ROAD TRIPS", tag: "ONLINE POSTERS" },
  { img: w6, title: "TRIP POSTERS", tag: "ONLINE POSTERS" },
  { img: w7, title: "BIRTHDAY POSTER", tag: "ONLINE POSTERS" },
];

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? works[activeIndex] : null;

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Selected work</span>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              The <span className="text-gradient">portfolio</span>.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            A glimpse into recent projects spanning flyers, branding, posters, social and 3D type.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w, i) => (
            <button
              type="button"
              key={w.title + i}
              onClick={() => setActiveIndex(i)}
              className={`group relative overflow-hidden rounded-3xl glass shadow-glow text-left ${
                i === 0 ? "lg:row-span-2 lg:aspect-auto" : "aspect-[4/5]"
              }`}
            >
              <img
                src={w.img}
                alt={w.title}
                loading="lazy"
                width={1024}
                height={1280}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-accent">{w.tag}</div>
                    <h3 className="mt-1 font-display text-xl font-bold">{w.title}</h3>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:rotate-45">
                    ↗
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActiveIndex(null)}>
        <DialogContent className="max-w-5xl w-full bg-background/95 border-0 p-2 sm:p-4">
          <DialogTitle className="sr-only">{active?.title ?? "Poster preview"}</DialogTitle>
          {active && (
            <div className="flex flex-col items-center gap-3">
              <img
                src={active.img}
                alt={active.title}
                className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
              />
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-accent">{active.tag}</div>
                <h3 className="font-display text-xl font-bold">{active.title}</h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
