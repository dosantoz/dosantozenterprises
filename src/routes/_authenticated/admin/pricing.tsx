import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdminNav, requireAdminRoute } from "@/lib/admin-shared";
import { listAllTiers, upsertTier, deleteTier } from "@/lib/cms.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/pricing")({
  ssr: false,
  beforeLoad: requireAdminRoute,
  head: () => ({ meta: [{ title: "Pricing — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminPricing,
});

type Tier = {
  id?: string;
  name: string;
  price_kes: number;
  features: string[];
  sort_order: number;
  is_active: boolean;
  highlight: boolean;
};

function AdminPricing() {
  const listFn = useServerFn(listAllTiers);
  const upFn = useServerFn(upsertTier);
  const delFn = useServerFn(deleteTier);
  const q = useQuery({ queryKey: ["admin-tiers"], queryFn: () => listFn() });
  const [editing, setEditing] = useState<Tier | null>(null);

  async function save() {
    if (!editing) return;
    try {
      await upFn({
        data: {
          id: editing.id,
          name: editing.name,
          price_kes: editing.price_kes,
          features: editing.features,
          sort_order: editing.sort_order,
          is_active: editing.is_active,
          highlight: editing.highlight,
        },
      });
      toast.success("Saved");
      setEditing(null);
      q.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <SiteLayout>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent">Admin</span>
              <h1 className="mt-2 font-display text-4xl font-bold">Pricing tiers</h1>
            </div>
            <AdminNav current="pricing" />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                setEditing({
                  name: "",
                  price_kes: 0,
                  features: [],
                  sort_order: (q.data?.length ?? 0) * 10 + 10,
                  is_active: true,
                  highlight: false,
                })
              }
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              + Add tier
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(q.data ?? []).map((t: any) => (
              <div key={t.id} className="rounded-2xl glass p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {t.name}{" "}
                      {t.highlight && (
                        <span className="ml-2 rounded bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                          POPULAR
                        </span>
                      )}
                      {!t.is_active && (
                        <span className="ml-2 rounded bg-muted px-2 py-0.5 text-[10px]">HIDDEN</span>
                      )}
                    </div>
                    <div className="mt-1 font-display text-2xl font-bold">
                      {t.price_kes > 0 ? `KSh ${t.price_kes.toLocaleString()}` : "Custom"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setEditing({ ...t, features: (t.features as string[]) ?? [] })}
                      className="rounded-full glass px-3 py-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${t.name}?`)) return;
                        await delFn({ data: { id: t.id } });
                        q.refetch();
                      }}
                      className="rounded-full glass px-3 py-1 text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {((t.features as string[]) ?? []).map((f: string) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl glass p-6 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">{editing.id ? "Edit tier" : "New tier"}</h3>
              <button onClick={() => setEditing(null)} className="text-2xl leading-none">
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <Field label="Name">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Price (KSh, 0 = Custom)">
                <input
                  type="number"
                  min={0}
                  value={editing.price_kes}
                  onChange={(e) =>
                    setEditing({ ...editing, price_kes: parseInt(e.target.value || "0", 10) })
                  }
                  className="input"
                />
              </Field>
              <Field label="Features (one per line)">
                <textarea
                  rows={5}
                  value={editing.features.join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="input"
                />
              </Field>
              <Field label="Sort order">
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) =>
                    setEditing({ ...editing, sort_order: parseInt(e.target.value || "0", 10) })
                  }
                  className="input"
                />
              </Field>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.is_active}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.highlight}
                    onChange={(e) => setEditing({ ...editing, highlight: e.target.checked })}
                  />
                  Highlight (Popular)
                </label>
              </div>
              <button onClick={save} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 [&_.input]:mt-0 [&_.input]:w-full [&_.input]:rounded-xl [&_.input]:border [&_.input]:border-border [&_.input]:bg-background/60 [&_.input]:px-3 [&_.input]:py-2 [&_.input]:text-sm">
        {children}
      </div>
    </label>
  );
}
