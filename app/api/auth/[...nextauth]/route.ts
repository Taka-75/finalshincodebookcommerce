import { nextAuthOptions } from "@/app/lib/next-auth/options";
import NextAuth from "next-auth";

const handler = NextAuth(nextAuthOptions);

// Wrap the handler to log runtime details and capture initialization errors
export async function GET(request: Request) {
  try {
    console.log("NextAuth GET invoked. env:", {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GITHUB_ID: !!process.env.GITHUB_ID,
      GITHUB_SECRET: !!process.env.GITHUB_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
    });
    // delegate to next-auth handler
    return await handler(request as any);
  } catch (err) {
    console.error("NextAuth GET error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function POST(request: Request) {
  try {
    console.log("NextAuth POST invoked");
    return await handler(request as any);
  } catch (err) {
    console.error("NextAuth POST error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
