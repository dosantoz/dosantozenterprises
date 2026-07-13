import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listMyOrders, isAdmin } from "@/lib/orders.functions";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Dosantoz Enterprises" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const statusStyles: Record<string, string> = {
  pending_payment: "bg-yellow-500/20 text-yellow-300",
  paid: "bg-blue-500/20 text-blue-300",
  in_progress: "bg-primary/20 text-primary",
  revision: "bg-orange-500/20 text-orange-300",
  delivered: "bg-emerald-500/20 text-emerald-300",
  cancelled: "bg-red-500/20 text-red-300",
};

function Dashboard() {
  const listFn = useServerFn(listMyOrders);
  const adminFn = useServerFn(isAdmin);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const orders = useQuery({ queryKey: ["my-orders"], queryFn: () => listFn() });
  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => adminFn() });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SiteLayout>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent">Your account</span>
              <h1 className="mt-2 font-display text-4xl font-bold">Dashboard</h1>
            </div>
            <div className="flex gap-2">
              {admin.data?.admin && (
                <Link
                  to="/admin"
                  className="rounded-full glass px-4 py-2 text-sm font-semibold hover:ring-neon"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/order"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                New order
              </Link>
              <button onClick={signOut} className="rounded-full glass px-4 py-2 text-sm">
                Sign out
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-3xl glass p-6 shadow-glow">
            <h2 className="font-display text-2xl font-bold">Your orders</h2>
            {orders.isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
            {orders.data && orders.data.length === 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">No orders yet.</p>
                <Link
                  to="/order"
                  className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Start your first project
                </Link>
              </div>
            )}
            {orders.data && orders.data.length > 0 && (
              <ul className="mt-4 divide-y divide-border">
                {orders.data.map((o) => (
                  <li key={o.id}>
                    <Link
                      to="/orders/$id"
                      params={{ id: o.id }}
                      className="flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-white/5 rounded-xl px-2"
                    >
                      <div>
                        <div className="font-semibold">{o.project_type}</div>
                        <div className="text-xs text-muted-foreground">
                          {o.tier_name ?? "Custom"} • {new Date(o.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {o.amount_kes && (
                          <span className="text-sm">KSh {o.amount_kes.toLocaleString()}</span>
                        )}
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                            statusStyles[o.status] ?? "bg-white/10"
                          }`}
                        >
                          {o.status.replace("_", " ")}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
