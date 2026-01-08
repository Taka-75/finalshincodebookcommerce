import { createClient } from "microcms-js-sdk";
import type { BookType } from "@/app/types/types";

// microCMS クライアント
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN as string,
  apiKey: process.env.MICROCMS_API_KEY as string,
});

// 404 を吸収する安全な関数（一覧）
export const getAllBooks = async (): Promise<BookType[]> => {
  try {
    const data = await client.get<{ contents: BookType[] }>({
      endpoint: "books",
    });
    return data.contents ?? [];
  } catch (err) {
    console.warn("getAllBooks microCMS error:", err);
    // 失敗時でも map() が落ちないように空配列を返す
    return [];
  }
};

// 404 を吸収する安全な関数（詳細）
export const getDetailBook = async (id: string) => {
  try {
    const book = await client.get<BookType>({
      endpoint: "books",
      contentId: id,
    });
    return book;
  } catch (err) {
    console.warn("getDetailBook microCMS error:", err);
    return null;
  }
};
