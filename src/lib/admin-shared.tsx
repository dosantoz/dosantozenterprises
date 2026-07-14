import { redirect, Link } from "@tanstack/react-router";

export async function requireAdminRoute() {
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
}

type Tab = "orders" | "portfolio" | "pricing" | "testimonials";

export function AdminNav({ current }: { current: Tab }) {
  const items: { key: Tab; label: string; to: "/admin" | "/admin/portfolio" | "/admin/pricing" | "/admin/testimonials" }[] = [
    { key: "orders", label: "Orders", to: "/admin" },
    { key: "portfolio", label: "Portfolio", to: "/admin/portfolio" },
    { key: "pricing", label: "Pricing", to: "/admin/pricing" },
    { key: "testimonials", label: "Testimonials", to: "/admin/testimonials" },
  ];
  return (
    <nav className="flex flex-wrap gap-2 rounded-full glass p-1.5 text-sm">
      {items.map((i) => (
        <Link
          key={i.key}
          to={i.to}
          className={`rounded-full px-4 py-1.5 transition ${
            current === i.key
              ? "bg-white/10 text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
