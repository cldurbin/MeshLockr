import { currentUser, clerkClient } from "@clerk/nextjs/server";
import supabase from "./supabase"; // Adjust path if needed

// Converts "My New Org!" -> "my-new-org"
export function generateOrgSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Create Clerk org + mirror it to Supabase
export async function createClerkOrganization(name: string) {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");

  const slug = generateOrgSlug(name);

  const org = await clerkClient.organizations.createOrganization({
    name,
    slug,
    createdBy: user.id,
  });

  // 💾 Store org in Supabase mirror table
  const { error } = await supabase.from("orgs").insert({
    id: org.id,
    name: org.name,
    slug: org.slug,
    created_by: user.id,
  });

  if (error) {
    console.error("❌ Failed to sync org to Supabase:", error);
  }

  // 📌 Optional: Set active org in user metadata
  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      activeOrgId: org.id,
    },
  });

  return org;
}

// Invite teammates using Clerk + optional redirect
export async function inviteTeammates(orgId: string, emails: string[]) {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");

  const invites = await Promise.all(
    emails.map((email) =>
      clerkClient.organizations.createOrganizationInvitation({
        organizationId: orgId,
        inviterUserId: user.id,
        emailAddress: email,
        role: "basic_member", // or allow UI-selected roles later
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`,
      })
    )
  );

  return invites;
}
