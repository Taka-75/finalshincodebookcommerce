import { createClient } from "microcms-js-sdk";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_API_KEY;

console.log("DEBUG_env microcms", {
  domain: SERVICE_DOMAIN,
  api: API_KEY,
  hasCredentials: !!(SERVICE_DOMAIN && API_KEY),
});

const getClient = () => {
  if (!SERVICE_DOMAIN || !API_KEY) {
    console.warn(
      "microCMS credentials missing: MICROCMS_SERVICE_DOMAIN or MICROCMS_API_KEY not set. Skipping microCMS requests."
    );
    return null;
  }
  return createClient({
    serviceDomain: SERVICE_DOMAIN as string,
    apiKey: API_KEY as string,
  });
};

// 404 を吸収する安全な関数
export const getAllBooks = async () => {
  try {
    const client = getClient();
    if (!client) return { contents: [] };

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
    const client = getClient();
    if (!client) return null;

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
