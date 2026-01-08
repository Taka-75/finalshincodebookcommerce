import Book from "./components/Book";
import { BookType } from "./types/types";
import { getAllBooks } from "./lib/microcms/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./lib/next-auth/options";

// This page uses server-side session information and must be dynamically rendered at runtime.
export const dynamic = "force-dynamic";

export default async function Home() {
  let user: any = null;

  try {
    const session = await getServerSession(nextAuthOptions);
    user = session?.user;
  } catch (err) {
    console.error("getServerSession error in home:", err);
    user = null;
  }

  // Fetch books from microCMS
  let books: BookType[] = [];
  try {
    const res = await getAllBooks();
    books = res ?? [];
  } catch (err) {
    console.warn("getAllBooks error:", err);
    books = [];
  }

  // Fetch purchases for signed-in user to mark purchased items
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? 3002}`;
  let purchases: any[] = [];

  if (user?.id) {
    try {
      const response = await fetch(`${baseUrl}/api/purchases/${user.id}`);
      const contentType = response.headers.get("content-type") ?? "";
      if (response.ok && contentType.includes("application/json")) {
        purchases = await response.json();
      } else {
        const text = await response.text();
        console.warn("purchases fetch unexpected response:", response.status, text.slice(0, 200));
        purchases = [];
      }
    } catch (err) {
      console.warn("purchases fetch error:", err);
      purchases = [];
    }
  }

  const purchasedIds = new Set(purchases.map((p: any) => p.bookId));

  return (
    <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
      <h2 className="text-center w-full font-bold text-3xl mb-2">Book Commerce</h2>
      {books.map((book) => (
        <Book key={book.id} book={book} user={user} isPurchased={purchasedIds.has(book.id)} />
      ))}
    </main>
  );
}
