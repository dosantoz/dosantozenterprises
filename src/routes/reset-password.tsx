import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Dosantoz Enterprises" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase places the recovery token in the URL hash; getSession picks it up.
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setReady(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }

  return (
    <SiteLayout>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-md px-5">
          <div className="rounded-3xl glass p-8 shadow-glow">
            <h1 className="font-display text-2xl font-bold">Set a new password</h1>
            {!ready ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Open the reset link from your email on this device to continue.
              </p>
            ) : (
              <form onSubmit={handle} className="mt-5 space-y-3">
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  disabled={busy}
                  className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  Update password
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
