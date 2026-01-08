import Book from "./components/Book";
import { BookType } from "./types/types";
import { getAllBooks } from "./lib/microcms/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./lib/next-auth/options";

// This page uses server-side session information and must be dynamically rendered at runtime.
export const dynamic = "force-dynamic";

export default async function Home() {
  console.log("Home: component rendering started");
  
  let user: any = null;

  try {
    console.log("Home: calling getServerSession");
    const session = await getServerSession(nextAuthOptions);
    user = session?.user;
    console.log("Home: getServerSession completed, user:", !!user);
  } catch (err) {
    console.error("getServerSession error in home:", err);
    user = null;
  }

  // Fetch books from microCMS
  let books: BookType[] = [];
  try {
    console.log("Home: calling getAllBooks");
    const res = await getAllBooks();
    console.log("Home: getAllBooks returned, type:", typeof res, "isArray:", Array.isArray(res));
    
    // res が配列であることを確認（getAllBooks は配列を返すはずだが、念のため）
    if (Array.isArray(res)) {
      books = res;
      console.log("Home: books set, length:", books.length);
    } else {
      console.warn("getAllBooks returned non-array:", typeof res, res);
      books = [];
    }
  } catch (err) {
    console.error("getAllBooks error in Home:", err);
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

  // purchases が配列であることを確認
  const safePurchases = Array.isArray(purchases) ? purchases : [];
  const purchasedIds = new Set(safePurchases.map((p: any) => p.bookId));

  // 最終的な安全チェック
  const safeBooks = Array.isArray(books) ? books : [];
  console.log("Home: rendering with books, length:", safeBooks.length);

  return (
    <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
      <h2 className="text-center w-full font-bold text-3xl mb-2">Book Commerce</h2>
      {safeBooks.map((book) => (
        <Book key={book.id} book={book} user={user} isPurchased={purchasedIds.has(book.id)} />
      ))}
    </main>
  );
}
