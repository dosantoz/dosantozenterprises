-- Revoke EXECUTE from anon/authenticated on trigger-only SECURITY DEFINER functions.
-- These are called by database triggers, never by end users directly.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_admin_on_signup() FROM PUBLIC, anon, authenticated;

-- has_role is invoked from RLS policies and needs to remain executable by
-- authenticated. Restrict it to that role only (drop anon/public).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;