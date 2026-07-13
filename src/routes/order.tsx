import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { createOrder } from "@/lib/orders.functions";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  tier: z.string().optional(),
  amount: z.coerce.number().optional(),
});

export const Route = createFileRoute("/order")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Start a design project — Dosantoz Enterprises" },
      {
        name: "description",
        content:
          "Book a poster, flyer, brand kit, or full campaign. Fill in your brief in 60 seconds and we'll get started.",
      },
    ],
  }),
  component: OrderPage,
});

const projectTypes = [
  "Poster / Flyer",
  "Club Poster",
  "Birthday Poster",
  "Church Poster",
  "Business Flyer",
  "Rollup Banner",
  "Brand Identity Kit",
  "Social Media Design",
  "Motion Graphic",
  "3D Type / Logo",
  "Event Branding",
  "Other",
];

function OrderPage() {
  const search = useSearch({ from: "/order" });
  const navigate = useNavigate();
  const createOrderFn = useServerFn(createOrder);

  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [brief, setBrief] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!signedIn) {
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    try {
      const { id } = await createOrderFn({
        data: {
          project_type: projectType,
          brief,
          deadline: deadline || null,
          budget_kes: budget ? parseInt(budget, 10) : null,
          tier_name: search.tier ?? null,
          amount_kes: search.amount ?? null,
        },
      });
      toast.success("Order submitted");
      navigate({ to: "/orders/$id", params: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-5">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Start a project</span>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Tell us <span className="text-gradient">what you need</span>.
          </h1>
          <p className="mt-3 text-muted-foreground">
            {search.tier
              ? `Package selected: ${search.tier}${search.amount ? ` — KSh ${search.amount.toLocaleString()}` : ""}.`
              : "60 seconds. We reply within an hour."}
          </p>

          {signedIn === false && (
            <div className="mt-6 rounded-2xl glass p-4 text-sm">
              You'll need an account to track your project.{" "}
              <Link to="/auth" className="text-primary underline">
                Sign in or create one
              </Link>
              .
            </div>
          )}

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl glass p-6 shadow-glow">
            <label className="block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Project type</div>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {projectTypes.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Brief</div>
              <textarea
                required
                rows={6}
                minLength={10}
                maxLength={4000}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Event name, date, colors, references, must-have text…"
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Deadline</div>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Budget (KSh)</div>
                <input
                  type="number"
                  min={0}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 1000"
                  className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <button
              disabled={busy}
              className="mt-2 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {busy ? "Submitting…" : signedIn ? "Submit order" : "Sign in & submit"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              After submitting you can upload references, chat with your designer, and (soon) pay online.
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
