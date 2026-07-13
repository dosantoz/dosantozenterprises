import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createOrderSchema = z.object({
  project_type: z.string().trim().min(2).max(100),
  brief: z.string().trim().min(10).max(4000),
  deadline: z.string().nullable().optional(),
  budget_kes: z.number().int().nonnegative().nullable().optional(),
  tier_name: z.string().max(80).nullable().optional(),
  amount_kes: z.number().int().nonnegative().nullable().optional(),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createOrderSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("orders")
      .insert({
        user_id: context.userId,
        project_type: data.project_type,
        brief: data.brief,
        deadline: data.deadline || null,
        budget_kes: data.budget_kes ?? null,
        tier_name: data.tier_name ?? null,
        amount_kes: data.amount_kes ?? null,
        status: "pending_payment",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, project_type, tier_name, status, amount_kes, deadline, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: order, error } = await context.supabase
      .from("orders")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    const { data: messages } = await context.supabase
      .from("order_messages")
      .select("id, sender_id, body, created_at")
      .eq("order_id", data.id)
      .order("created_at", { ascending: true });

    return { order, messages: messages ?? [] };
  });

export const sendOrderMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ order_id: z.string().uuid(), body: z.string().trim().min(1).max(2000) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("order_messages").insert({
      order_id: data.order_id,
      sender_id: context.userId,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const isAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) return { admin: false };
    return { admin: !!data };
  });
