import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdminNav, requireAdminRoute } from "@/lib/admin-shared";
import { listAllTestimonials, upsertTestimonial, deleteTestimonial } from "@/lib/cms.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  ssr: false,
  beforeLoad: requireAdminRoute,
  head: () => ({ meta: [{ title: "Testimonials — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminTestimonials,
});

type T = {
  id?: string;
  name: string;
  role: string | null;
  quote: string;
  avatar_url: string | null;
  is_published: boolean;
  sort_order: number;
  rating: number;
};

function AdminTestimonials() {
  const listFn = useServerFn(listAllTestimonials);
  const upFn = useServerFn(upsertTestimonial);
  const delFn = useServerFn(deleteTestimonial);
  const q = useQuery({ queryKey: ["admin-testimonials"], queryFn: () => listFn() });
  const [editing, setEditing] = useState<T | null>(null);

  async function save() {
    if (!editing) return;
    try {
      await upFn({
        data: {
          id: editing.id,
          name: editing.name,
          role: editing.role,
          quote: editing.quote,
          avatar_url: editing.avatar_url,
          is_published: editing.is_published,
          sort_order: editing.sort_order,
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
              <h1 className="mt-2 font-display text-4xl font-bold">Testimonials</h1>
            </div>
            <AdminNav current="testimonials" />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                setEditing({
                  name: "",
                  role: "",
                  quote: "",
                  avatar_url: "",
                  is_published: true,
                  sort_order: (q.data?.length ?? 0) * 10 + 10,
                })
              }
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              + Add testimonial
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {(q.data ?? []).map((t: any) => (
              <div key={t.id} className="rounded-2xl glass p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">
                      {t.name}{" "}
                      <span className="text-xs text-muted-foreground">{t.role}</span>
                      {!t.is_published && (
                        <span className="ml-2 rounded bg-muted px-2 py-0.5 text-[10px]">HIDDEN</span>
                      )}
                    </div>
                    <blockquote className="mt-2 text-sm text-muted-foreground">"{t.quote}"</blockquote>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setEditing(t)}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl glass p-6 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">{editing.id ? "Edit" : "New"}</h3>
              <button onClick={() => setEditing(null)} className="text-2xl leading-none">✕</button>
            </div>
            <div className="space-y-3">
              <Field label="Name"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></Field>
              <Field label="Role"><input value={editing.role ?? ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="input" /></Field>
              <Field label="Quote"><textarea rows={4} value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} className="input" /></Field>
              <Field label="Avatar URL (optional)"><input value={editing.avatar_url ?? ""} onChange={(e) => setEditing({ ...editing, avatar_url: e.target.value })} className="input" /></Field>
              <Field label="Sort order"><input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value || "0", 10) })} className="input" /></Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
                Published
              </label>
              <button onClick={save} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">Save</button>
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
