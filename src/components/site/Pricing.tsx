import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { listPricing } from "@/lib/cms.functions";

export function Pricing() {
  const fetchFn = useServerFn(listPricing);
  const q = useQuery({ queryKey: ["pricing"], queryFn: () => fetchFn() });
  const tiers = q.data ?? [];

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Pricing</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Simple, <span className="text-gradient">premium packages</span>.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => {
            const features = (t.features as string[]) ?? [];
            const priceLabel = t.price_kes > 0 ? `KSh ${t.price_kes.toLocaleString()}` : "Custom";
            return (
              <div
                key={t.id}
                className={`relative rounded-3xl p-8 shadow-glow ${
                  t.highlight ? "glass ring-neon" : "glass"
                }`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                    Popular
                  </span>
                )}
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {t.name}
                </div>
                <div className="mt-3 font-display text-4xl font-bold text-gradient">
                  {priceLabel}
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 whitespace-pre-line">
                      <span className="mt-1 text-accent">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/order"
                  search={{ tier: t.name, amount: t.price_kes || undefined }}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                    t.highlight
                      ? "bg-primary text-primary-foreground hover:scale-[1.02]"
                      : "glass hover:ring-neon"
                  }`}
                >
                  {t.price_kes > 0 ? "Get Started" : "Book a Call"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
