import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listTestimonials } from "@/lib/cms.functions";

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const fetchFn = useServerFn(listTestimonials);
  const q = useQuery({ queryKey: ["testimonials"], queryFn: () => fetchFn() });
  const items = q.data ?? [];

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
            <figure key={it.id} className="rounded-3xl glass p-7 shadow-glow">
              <div className="text-primary">★★★★★</div>
              <blockquote className="mt-4 text-foreground/90">"{it.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {it.avatar_url ? (
                  <img
                    src={it.avatar_url}
                    alt={it.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display font-bold text-primary-foreground">
                    {initialsOf(it.name)}
                  </span>
                )}
                <span>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.role}</div>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
