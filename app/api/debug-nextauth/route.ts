export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";

export async function GET() {
  try {
    const session = await getServerSession(nextAuthOptions as any);
    return new Response(JSON.stringify({ ok: true, hasSession: !!session }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("debug-nextauth GET error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err), stack: String(err?.stack ?? "") }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
