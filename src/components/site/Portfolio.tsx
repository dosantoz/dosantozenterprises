import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Folder } from "lucide-react";

import w2 from "@/assets/work-2.jpg";
import w3 from "@/assets/work-3.jpg";
import w4 from "@/assets/work-4.jpg";
import w5 from "@/assets/work-5.jpg";
import w6 from "@/assets/work-6.jpg";
import w7 from "@/assets/work-7.jpg";
import b1 from "@/assets/banner-1.jpg";
import b2 from "@/assets/banner-2.jpg";
import b3 from "@/assets/banner-3.jpg";
import b4 from "@/assets/banner-4.jpg";
import b5 from "@/assets/banner-5.jpg";

type Work = { img: string; title: string };
type Category = { name: string; description: string; works: Work[] };

const categories: Category[] = [
  {
    name: "Road Trip Posters",
    description: "Posters designed for road trips and travel events.",
    works: [
      { img: w2, title: "Road Trip Posters" },
      { img: w5, title: "Road Trips" },
      { img: w6, title: "Trip Posters" },
    ],
  },
  {
    name: "Charity Posters",
    description: "Posters for charity drives and fundraising events.",
    works: [{ img: w3, title: "Charity Posters" }],
  },
  {
    name: "Club Posters",
    description: "Posters tailored for clubs and nightlife events.",
    works: [{ img: w4, title: "Club Posters" }],
  },
  {
    name: "Birthday Posters",
    description: "Celebration posters for birthdays and milestones.",
    works: [{ img: w7, title: "Birthday Poster" }],
  },
  {
    name: "Church Posters",
    description: "Posters and flyers crafted for church events.",
    works: [],
  },
  {
    name: "Public Holiday Flyers",
    description: "Flyers for public holidays and national celebrations.",
    works: [],
  },
  {
    name: "Business Flyers",
    description: "Professional flyers for businesses and promotions.",
    works: [],
  },
  {
    name: "Rollup Stand Printing",
    description: "Roll-up banners and stand printing designs.",
    works: [
      { img: b1, title: "SJ Grill Banner" },
      { img: b2, title: "Infinity Stitches Banner" },
      { img: b3, title: "Avila Naturalle Banner" },
      { img: b4, title: "Celebration of Life Banner" },
      { img: b5, title: "A Priceless Mother Banner" },
    ],
  },
];

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? categories[activeIndex] : null;

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Selected work</span>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              The <span className="text-gradient">portfolio</span>.
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Browse our work by category. Tap a folder to swipe through every design inside.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const cover = c.works[0];
            return (
              <button
                type="button"
                key={c.name}
                onClick={() => setActiveIndex(i)}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl glass shadow-glow text-left"
              >
                {cover ? (
                  <img
                    src={cover.img}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-muted/40 to-background">
                    <Folder className="h-16 w-16 text-accent" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-accent">
                        {c.works.length} {c.works.length === 1 ? "design" : "designs"}
                      </div>
                      <h3 className="mt-1 font-display text-xl font-bold">{c.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {c.description}
                      </p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:rotate-45">
                      ↗
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActiveIndex(null)}>
        <DialogContent className="max-w-5xl w-full bg-background/95 border-0 p-4 sm:p-6">
          <DialogTitle className="text-center font-display text-2xl">
            {active?.name}
          </DialogTitle>
          {active && (
            <>
              {active.works.length === 0 ? (
                <div className="grid place-items-center py-16 text-center">
                  <Folder className="h-16 w-16 text-accent" />
                  <p className="mt-4 text-muted-foreground">
                    No designs in this folder yet. Check back soon.
                  </p>
                </div>
              ) : (
                <Carousel opts={{ loop: true }} className="mx-auto w-full max-w-3xl px-10">
                  <CarouselContent>
                    {active.works.map((w, i) => (
                      <CarouselItem key={i}>
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={w.img}
                            alt={w.title}
                            className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
                          />
                          <h3 className="font-display text-lg font-semibold">{w.title}</h3>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
