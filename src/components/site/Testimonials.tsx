import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { listTestimonials, submitTestimonial } from "@/lib/cms.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Stars({ value, size = "text-base" }: { value: number; size?: string }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className={`text-primary ${size}`} aria-label={`${v} out of 5 stars`}>
      {"★".repeat(v)}
      <span className="text-muted-foreground/40">{"★".repeat(5 - v)}</span>
    </div>
  );
}

function RatingInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className={`text-2xl transition ${n <= active ? "text-primary" : "text-muted-foreground/40"}`}
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-xs text-muted-foreground">{active}/5</span>
    </div>
  );
}

export function Testimonials() {
  const qc = useQueryClient();
  const fetchFn = useServerFn(listTestimonials);
  const submitFn = useServerFn(submitTestimonial);
  const q = useQuery({ queryKey: ["testimonials"], queryFn: () => fetchFn() });
  const items = q.data ?? [];

  const [session, setSession] = useState<{ userId: string; name: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [busy, setBusy] = useState(false);

  // Session snapshot for the CTA
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!mounted || !data.user) return;
      const meta = (data.user.user_metadata ?? {}) as Record<string, string>;
      let name = meta.full_name || meta.name || "";
      if (!name) {
        const { data: p } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.user.id)
          .maybeSingle();
        name = p?.full_name || data.user.email?.split("@")[0] || "Guest";
      }
      setSession({ userId: data.user.id, name });
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Realtime — refresh list when anyone publishes a review
  useEffect(() => {
    const channel = supabase
      .channel("testimonials-public")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        () => {
          qc.invalidateQueries({ queryKey: ["testimonials"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  const avg =
    items.length > 0
      ? items.reduce((s, t) => s + (t.rating ?? 5), 0) / items.length
      : 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    if (quote.trim().length < 4) {
      toast.error("Please write a short review");
      return;
    }
    setBusy(true);
    try {
      await submitFn({
        data: { name: session.name, role: role.trim() || null, quote: quote.trim(), rating },
      });
      toast.success("Thanks for your review!");
      setOpen(false);
      setQuote("");
      setRole("");
      setRating(5);
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="reviews" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Reviews</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Loved by <span className="text-gradient">brands & creators</span>.
          </h2>
          {items.length > 0 && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <Stars value={avg} size="text-xl" />
              <span className="text-sm text-muted-foreground">
                {avg.toFixed(1)} · {items.length} review{items.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((it: any) => (
            <figure key={it.id} className="rounded-3xl glass p-7 shadow-glow">
              <Stars value={it.rating ?? 5} />
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

        <div className="mt-12 flex flex-col items-center gap-3">
          {session ? (
            <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              ★ Leave a review
            </button>
          ) : (
            <Link
              to="/auth"
              className="rounded-full glass px-6 py-3 text-sm font-semibold"
            >
              Sign in to leave a review
            </Link>
          )}
          <p className="text-xs text-muted-foreground">Reviews appear live for everyone.</p>
        </div>
      </div>

      {open && session && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <form
            onSubmit={onSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl glass p-6 shadow-glow"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">Your review</h3>
              <button
                type="button"
                onClick={() => !busy && setOpen(false)}
                className="text-2xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Signed in as
                </div>
                <div className="mt-1 text-sm font-medium">{session.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Rating
                </div>
                <div className="mt-2">
                  <RatingInput value={rating} onChange={setRating} />
                </div>
              </div>
              <label className="block">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Role / company (optional)
                </div>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  maxLength={200}
                  className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm"
                  placeholder="Event planner, Nairobi"
                />
              </label>
              <label className="block">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Review
                </div>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm"
                  placeholder="Share your experience…"
                  required
                />
                <div className="mt-1 text-right text-[10px] text-muted-foreground">
                  {quote.length}/1000
                </div>
              </label>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {busy ? "Publishing…" : "Publish review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
