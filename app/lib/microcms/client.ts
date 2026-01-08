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
    
    // デバッグ用ログ（本番環境でも確認できるように）
    console.log("getAllBooks raw data:", {
      hasData: !!data,
      dataType: typeof data,
      isArray: Array.isArray(data),
      hasContents: data && typeof data === 'object' && 'contents' in data,
    });
    
    // data が存在し、contents が配列であることを確認
    if (data && typeof data === 'object' && 'contents' in data) {
      const contents = data.contents;
      if (Array.isArray(contents)) {
        return contents;
      } else {
        console.warn("getAllBooks: contents is not an array", typeof contents);
        return [];
      }
    }
    
    // data 自体が配列の場合（通常はないが、念のため）
    if (Array.isArray(data)) {
      console.warn("getAllBooks: data is directly an array (unexpected)");
      return data;
    }
    
    console.warn("getAllBooks: unexpected data structure", data);
    return [];
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
