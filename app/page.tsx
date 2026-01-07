import Book from "./components/Book";
import { BookType, Purchase } from "./types/types";
import { getAllBooks } from "./lib/microcms/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./lib/next-auth/options";

export default async function Home() {
  // サーバー側でセッション取得（エラーを吸収してログ出しする）
  let user: any = null;
  try {
    const session = await getServerSession(nextAuthOptions);
    user = session?.user ?? null;
  } catch (err) {
    console.error("getServerSession error:", err);
    user = null;
  }

  try {
    // --- 書籍一覧の取得（失敗しても空配列にする） ---
    let contents: BookType[] = [];
    try {
      const result = await getAllBooks();
      contents = (result as any)?.contents ?? [];
    } catch (err) {
      console.warn("getAllBooks error:", err);
      contents = [];
    }

    // --- 購入済みIDの取得（未ログインやエラーでも落とさない） ---
    let purchasedIds: (string | number)[] = [];

    if (user?.id) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

      try {
        const response = await fetch(`${baseUrl}/api/purchases/${user.id}`, {
          cache: "no-store",
        });

        const contentType = response.headers.get("content-type") ?? "";

        if (response.ok && contentType.includes("application/json")) {
          const purchasesData = (await response.json()) as Purchase[];
          purchasedIds = purchasesData.map((purchase) => purchase.bookId);
        } else {
          const text = await response.text();
          console.warn(
            "purchases unexpected response:",
            response.status,
            text.slice(0, 200)
          );
          purchasedIds = [];
        }
      } catch (err) {
        console.warn("purchases fetch error:", err);
        purchasedIds = [];
      }
    } else {
      // 未ログインなら購入済みIDは空
      purchasedIds = [];
    }

    return (
      <main className="flex flex-wrap justify-center items-center md:mt-20 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-4">
          Book Commerce
        </h2>

        {contents.length === 0 ? (
          <p className="text-center w-full">You have no books.</p>
        ) : (
          contents.map((book: BookType) => (
            <Book
              key={book.id}
              book={book}
              user={user}
              isPurchased={purchasedIds.includes(book.id)}
            />
          ))
        )}
      </main>
    );
  } catch (err) {
    console.error("Unexpected error rendering Home page:", err);
    return (
      <main className="p-8">
        <h2 className="text-xl font-bold">Internal server error</h2>
        <p>Please check server logs for details.</p>
      </main>
    );
  }
}
