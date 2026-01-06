import { createClient } from "microcms-js-sdk";

console.log("DEBUG_env", {
  domain: process.env.MICROCMS_SERVICE_DOMAIN,
  api: process.env.MICROCMS_API_KEY,
});

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN as string,
  apiKey: process.env.MICROCMS_API_KEY as string,
});

// 404 を吸収する安全な関数
export const getAllBooks = async () => {
  try {
    const data = await client.get({
      endpoint: "books",
    });
    return data;
  } catch (err) {
    console.warn("getAllBooks microCMS error:", err);
    return { contents: [] };
  }
};

export const getDetailBook = async (id: string) => {
  try {
    const book = await client.get({
      endpoint: "books",
      contentId: id,
    });
    return book;
  } catch (err) {
    console.warn("getDetailBook microCMS error:", err);
    return null;
  }
};
