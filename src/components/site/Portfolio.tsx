import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Folder } from "lucide-react";
import { listPortfolio } from "@/lib/cms.functions";

export function Portfolio() {
  const fetchFn = useServerFn(listPortfolio);
  const q = useQuery({ queryKey: ["portfolio"], queryFn: () => fetchFn() });
  const [activeCatId, setActiveCatId] = useState<string | null>(null);

  const categories = q.data?.categories ?? [];
  const items = q.data?.items ?? [];
  const itemsByCat = (id: string) => items.filter((i) => i.category_id === id);
  const active = categories.find((c) => c.id === activeCatId) ?? null;
  const activeWorks = active ? itemsByCat(active.id) : [];

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

        {q.isLoading && (
          <p className="mt-12 text-sm text-muted-foreground">Loading portfolio…</p>
        )}

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const works = itemsByCat(c.id);
            const cover = works[0];
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setActiveCatId(c.id)}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl glass shadow-glow text-left"
              >
                {cover ? (
                  <img
                    src={cover.image_url}
                    alt={c.title}
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
                        {works.length} {works.length === 1 ? "design" : "designs"}
                      </div>
                      <h3 className="mt-1 font-display text-xl font-bold">{c.title}</h3>
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

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActiveCatId(null)}>
        <DialogContent className="max-w-5xl w-full bg-background/95 border-0 p-4 sm:p-6">
          <DialogTitle className="text-center font-display text-2xl">{active?.title}</DialogTitle>
          {active && (
            <>
              {activeWorks.length === 0 ? (
                <div className="grid place-items-center py-16 text-center">
                  <Folder className="h-16 w-16 text-accent" />
                  <p className="mt-4 text-muted-foreground">
                    No designs in this folder yet. Check back soon.
                  </p>
                </div>
              ) : (
                <Carousel opts={{ loop: true }} className="mx-auto w-full max-w-3xl px-10">
                  <CarouselContent>
                    {activeWorks.map((w) => (
                      <CarouselItem key={w.id}>
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={w.image_url}
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
