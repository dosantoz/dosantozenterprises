import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { listAllOrders, updateOrderStatus } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: userRow } = await supabase.auth.getUser();
    if (!userRow.user) throw redirect({ to: "/auth" });
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userRow.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [{ title: "Admin — Dosantoz Enterprises" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

const statusOptions = [
  "pending_payment",
  "paid",
  "in_progress",
  "revision",
  "delivered",
  "cancelled",
] as const;

function AdminPage() {
  const listFn = useServerFn(listAllOrders);
  const updateFn = useServerFn(updateOrderStatus);
  const q = useQuery({ queryKey: ["admin-orders"], queryFn: () => listFn() });

  return (
    <SiteLayout>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent">Admin</span>
              <h1 className="mt-2 font-display text-4xl font-bold">All orders</h1>
            </div>
            <Link to="/dashboard" className="rounded-full glass px-4 py-2 text-sm">
              My account
            </Link>
          </div>

          <div className="mt-8 rounded-3xl glass p-6 shadow-glow overflow-x-auto">
            {q.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {q.data && q.data.length === 0 && (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
            {q.data && q.data.length > 0 && (
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-3">When</th>
                    <th className="py-2 pr-3">Project</th>
                    <th className="py-2 pr-3">Tier</th>
                    <th className="py-2 pr-3">Amount</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {q.data.map((o) => (
                    <tr key={o.id}>
                      <td className="py-3 pr-3 text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 pr-3">{o.project_type}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{o.tier_name ?? "—"}</td>
                      <td className="py-3 pr-3">
                        {o.amount_kes ? `KSh ${o.amount_kes.toLocaleString()}` : "—"}
                      </td>
                      <td className="py-3 pr-3">
                        <select
                          defaultValue={o.status}
                          onChange={async (e) => {
                            try {
                              await updateFn({
                                data: {
                                  id: o.id,
                                  status: e.target.value as (typeof statusOptions)[number],
                                },
                              });
                              toast.success("Updated");
                              q.refetch();
                            } catch (err) {
                              toast.error(err instanceof Error ? err.message : "Failed");
                            }
                          }}
                          className="rounded-lg border border-border bg-background/60 px-2 py-1 text-xs"
                        >
                          {statusOptions.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-3">
                        <Link to="/orders/$id" params={{ id: o.id }} className="text-primary hover:underline">
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
