/**
 * Supabase clients — auth + Postgres for Unschool Academy.
 *
 * Blueprint §6: "Authentication: modern provider with server-checked sessions…
 * Data: managed Postgres… Supabase is an option."
 *
 * Until the user connects a Supabase project (SUPABASE_URL + SUPABASE_ANON_KEY),
 * every consumer must degrade honestly: `isSupabaseConfigured()` gates all
 * calls; pages show "not connected yet" instead of fake auth.
 */
import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component — middleware refreshes the session.
          }
        },
      },
    }
  );
}

/** Server-side current user (null when not configured or signed out). */
export async function currentUser() {
  if (!isSupabaseConfigured()) return null;
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  return data.user;
}

/** Server-side role check. Roles live in public.user_roles (see supabase/schema.sql). */
export async function userRoles(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = await supabaseServer();
  const { data } = await sb.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r) => r.role as string);
}

export async function hasRole(userId: string, role: string): Promise<boolean> {
  return (await userRoles(userId)).includes(role);
}
