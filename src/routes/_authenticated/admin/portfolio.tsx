import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdminNav, requireAdminRoute } from "@/lib/admin-shared";
import {
  listPortfolio,
  upsertCategory,
  deleteCategory,
  upsertItem,
  deleteItem,
} from "@/lib/cms.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/portfolio")({
  ssr: false,
  beforeLoad: requireAdminRoute,
  head: () => ({ meta: [{ title: "Portfolio — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminPortfolio,
});

type Cat = { id: string; slug: string; title: string; description: string | null; sort_order: number };
type Item = { id: string; category_id: string; title: string; image_url: string; sort_order: number };

function AdminPortfolio() {
  const fetchFn = useServerFn(listPortfolio);
  const q = useQuery({ queryKey: ["admin-portfolio"], queryFn: () => fetchFn() });
  const upCat = useServerFn(upsertCategory);
  const delCat = useServerFn(deleteCategory);
  const upItem = useServerFn(upsertItem);
  const delItem = useServerFn(deleteItem);

  const [editingCat, setEditingCat] = useState<Partial<Cat> | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<Item> | null>(null);

  const cats = (q.data?.categories ?? []) as Cat[];
  const items = (q.data?.items ?? []) as Item[];

  async function saveCat() {
    if (!editingCat) return;
    try {
      await upCat({
        data: {
          id: editingCat.id,
          slug: editingCat.slug || "",
          title: editingCat.title || "",
          description: editingCat.description ?? null,
          sort_order: editingCat.sort_order ?? 0,
        },
      });
      toast.success("Saved");
      setEditingCat(null);
      q.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function saveItem() {
    if (!editingItem) return;
    try {
      await upItem({
        data: {
          id: editingItem.id,
          category_id: editingItem.category_id || "",
          title: editingItem.title || "",
          image_url: editingItem.image_url || "",
          sort_order: editingItem.sort_order ?? 0,
        },
      });
      toast.success("Saved");
      setEditingItem(null);
      q.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <SiteLayout>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent">Admin</span>
              <h1 className="mt-2 font-display text-4xl font-bold">Portfolio</h1>
            </div>
            <AdminNav current="portfolio" />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Categories</h2>
            <button
              onClick={() => setEditingCat({ slug: "", title: "", sort_order: 0 })}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              + Add category
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {cats.map((c) => (
              <div key={c.id} className="rounded-2xl glass p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      {c.title}{" "}
                      <span className="ml-2 text-xs text-muted-foreground">/{c.slug}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {items.filter((i) => i.category_id === c.id).length} designs · sort{" "}
                      {c.sort_order}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCat(c)}
                      className="rounded-full glass px-3 py-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setEditingItem({ category_id: c.id, title: "", image_url: "", sort_order: 0 })
                      }
                      className="rounded-full glass px-3 py-1 text-xs"
                    >
                      + Add design
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${c.title} and all its designs?`)) return;
                        await delCat({ data: { id: c.id } });
                        q.refetch();
                      }}
                      className="rounded-full glass px-3 py-1 text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {items
                    .filter((i) => i.category_id === c.id)
                    .map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center gap-3 rounded-xl border border-border/40 p-2"
                      >
                        <img
                          src={it.image_url}
                          alt={it.title}
                          className="h-16 w-16 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{it.title}</div>
                          <div className="text-xs text-muted-foreground">sort {it.sort_order}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => setEditingItem(it)}
                            className="rounded-full glass px-2 py-0.5 text-[10px]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm(`Delete ${it.title}?`)) return;
                              await delItem({ data: { id: it.id } });
                              q.refetch();
                            }}
                            className="rounded-full glass px-2 py-0.5 text-[10px] text-red-400"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {editingCat && (
        <Modal title={editingCat.id ? "Edit category" : "New category"} onClose={() => setEditingCat(null)}>
          <Field label="Slug (a-z, 0-9, -)">
            <input
              value={editingCat.slug ?? ""}
              onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Title">
            <input
              value={editingCat.title ?? ""}
              onChange={(e) => setEditingCat({ ...editingCat, title: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={2}
              value={editingCat.description ?? ""}
              onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              value={editingCat.sort_order ?? 0}
              onChange={(e) =>
                setEditingCat({ ...editingCat, sort_order: parseInt(e.target.value || "0", 10) })
              }
              className="input"
            />
          </Field>
          <button onClick={saveCat} className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
            Save
          </button>
        </Modal>
      )}

      {editingItem && (
        <Modal title={editingItem.id ? "Edit design" : "New design"} onClose={() => setEditingItem(null)}>
          <Field label="Category">
            <select
              value={editingItem.category_id ?? ""}
              onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
              className="input"
            >
              <option value="">— Select —</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title">
            <input
              value={editingItem.title ?? ""}
              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Image URL">
            <input
              value={editingItem.image_url ?? ""}
              onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
              placeholder="https://... or /__l5e/..."
              className="input"
            />
            {editingItem.image_url && (
              <img src={editingItem.image_url} alt="preview" className="mt-2 max-h-40 rounded" />
            )}
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              value={editingItem.sort_order ?? 0}
              onChange={(e) =>
                setEditingItem({ ...editingItem, sort_order: parseInt(e.target.value || "0", 10) })
              }
              className="input"
            />
          </Field>
          <button onClick={saveItem} className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
            Save
          </button>
        </Modal>
      )}
    </SiteLayout>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl glass p-6 shadow-glow"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-2xl leading-none">
            ✕
          </button>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
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
