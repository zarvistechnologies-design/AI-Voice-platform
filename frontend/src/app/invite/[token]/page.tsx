import { InviteAccept } from "@/components/auth/InviteAccept";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <InviteAccept token={token} />;
}
