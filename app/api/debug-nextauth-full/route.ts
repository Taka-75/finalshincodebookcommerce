import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    console.log("debug-nextauth-full invoked. env presence:", {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      GITHUB_ID: !!process.env.GITHUB_ID,
      GITHUB_SECRET: !!process.env.GITHUB_SECRET,
    });

    try {
      // Try to initialize NextAuth handler (this can throw during setup)
      const handler = NextAuth(nextAuthOptions as any);
      if (!handler) console.warn("NextAuth handler returned falsy");
    } catch (e: any) {
      console.error("NextAuth initializer error:", e);
      return new Response(
        JSON.stringify({ ok: false, phase: "initializer", error: String(e), stack: String(e?.stack ?? "") }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      // Test Prisma connectivity (non-destructive)
      await prisma.$connect();
      await prisma.$disconnect();
    } catch (e: any) {
      console.error("Prisma connection error:", e);
      return new Response(
        JSON.stringify({ ok: false, phase: "prisma_connect", error: String(e), stack: String(e?.stack ?? "") }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const { getServerSession } = await import("next-auth");
      const session = await getServerSession(nextAuthOptions as any);
      return new Response(JSON.stringify({ ok: true, sessionPresent: !!session }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (e: any) {
      console.error("getServerSession error:", e);
      return new Response(
        JSON.stringify({ ok: false, phase: "getServerSession", error: String(e), stack: String(e?.stack ?? "") }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    console.error("debug-nextauth-full outer error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err), stack: String(err?.stack ?? "") }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}