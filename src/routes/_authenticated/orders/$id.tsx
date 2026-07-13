import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getOrder, sendOrderMessage } from "@/lib/orders.functions";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order — Dosantoz Enterprises" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const getFn = useServerFn(getOrder);
  const sendFn = useServerFn(sendOrderMessage);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["order", id],
    queryFn: () => getFn({ data: { id } }),
    refetchInterval: 15000,
  });

  const [body, setBody] = useState("");
  const send = useMutation({
    mutationFn: (text: string) => sendFn({ data: { order_id: id, body: text } }),
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (q.isLoading) return <SiteLayout><div className="pt-32 text-center">Loading…</div></SiteLayout>;
  if (q.error || !q.data) return <SiteLayout><div className="pt-32 text-center">Order not found.</div></SiteLayout>;

  const { order, messages } = q.data;

  return (
    <SiteLayout>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-5">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to dashboard
          </Link>

          <div className="mt-4 rounded-3xl glass p-6 shadow-glow">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl font-bold">{order.project_type}</h1>
                <div className="text-xs text-muted-foreground">
                  {order.tier_name ?? "Custom"} • {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
              <span className="self-start rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                {order.status.replace("_", " ")}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
              {order.amount_kes != null && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">Amount</dt>
                  <dd>KSh {order.amount_kes.toLocaleString()}</dd>
                </div>
              )}
              {order.deadline && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">Deadline</dt>
                  <dd>{new Date(order.deadline).toLocaleDateString()}</dd>
                </div>
              )}
              {order.budget_kes != null && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">Budget</dt>
                  <dd>KSh {order.budget_kes.toLocaleString()}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Brief</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm">{order.brief}</p>
            </div>

            {order.status === "pending_payment" && (
              <div className="mt-6 rounded-2xl bg-yellow-500/10 p-4 text-sm">
                Payment isn't set up online yet — the studio will confirm your order and share payment details via message below or WhatsApp.
              </div>
            )}
          </div>

          <div className="mt-6 rounded-3xl glass p-6 shadow-glow">
            <h2 className="font-display text-xl font-bold">Messages</h2>
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">No messages yet. Say hi!</p>
              )}
              {messages.map((m) => (
                <div key={m.id} className="rounded-2xl bg-background/40 border border-border p-3">
                  <div className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm">{m.body}</div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (body.trim()) send.mutate(body.trim());
              }}
              className="mt-4 flex gap-2"
            >
              <input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Send a message…"
                className="flex-1 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                disabled={send.isPending || !body.trim()}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
