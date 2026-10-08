import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Section, Button, Card, Breadcrumbs, PageHero, Callout } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase";
import { currentUser } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/sign-out-button";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your Unschool Academy account: profile, learning data, and deletion requests.",
};

export default async function AccountPage() {
  const configured = isSupabaseConfigured();
  const user = await currentUser();
  if (configured && !user) redirect("/login");

  return (
    <>
      <PageHero eyebrow="Account" title="Your account" sub="Profile, data, and deletion — in one place, in plain language." />
      <Section>
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Account" }]} />
          {!configured ? (
            <Callout title="Accounts not connected yet" tone="info">
              Sign-in is staged until a Supabase project is connected. Nothing here manages a real profile yet —
              when accounts launch, this page will hold your real settings.
            </Callout>
          ) : (
            <Card className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-ink">{user!.email}</p>
                <p className="text-sm text-slate">Signed in · email {user!.email_confirmed_at ? "verified" : "verification pending"}</p>
              </div>
              <SignOutButton />
            </Card>
          )}
          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <Card>
              <h2 className="font-bold text-ink text-lg mb-2">Profile</h2>
              <p className="text-slate text-[15px]">Name, email, and password. Managed on your adult account; child profiles live under the Parent Hub.</p>
            </Card>
            <Card>
              <h2 className="font-bold text-ink text-lg mb-2">Learning data</h2>
              <p className="text-slate text-[15px]">Export your attempts, scores, and quest history any time — machine-readable, no dark patterns.</p>
            </Card>
            <Card>
              <h2 className="font-bold text-ink text-lg mb-2">Delete my account</h2>
              <p className="text-slate text-[15px]">Request full deletion from here. We confirm in writing and keep an audit trail. Families: use Parent Hub → Privacy for child data.</p>
              <div className="mt-4"><Button variant="secondary" size="sm" href="/contact">Request deletion</Button></div>
            </Card>
            <Card>
              <h2 className="font-bold text-ink text-lg mb-2">Billing</h2>
              <p className="text-slate text-[15px]">Plans, receipts, and cancellation. Checkout is in test mode during the pilot.</p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
