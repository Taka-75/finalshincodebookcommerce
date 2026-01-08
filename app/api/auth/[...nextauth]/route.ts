import { nextAuthOptions } from "@/app/lib/next-auth/options";

import NextAuth from "next-auth"


const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }

// これで直らない場合に有効（Edgeで落ちる回避）
export const runtime = "nodejs"
