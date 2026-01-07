import Book from "./components/Book";
import { BookType, Purchase } from "./types/types";
import { getAllBooks } from "./lib/microcms/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./lib/next-auth/options";

// This page uses server-side session information and must be dynamically rendered at runtime.
export const dynamic = "force-dynamic";

// Temporary minimal homepage used to isolate production rendering errors.
// If this page loads without a 500, the issue is inside the original Home implementation or one of its imports.
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Book Commerce (maintenance test)</h1>
      <p>If you see this page the site is serving a minimal homepage successfully.</p>
    </main>
  );
}
