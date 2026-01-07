// "use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import PurchaseProduct from "../components/PurchaseProduct";
import { getDetailBook } from "../lib/microcms/client";
import { BookType, Purchase, User } from "../types/types";
import Loading from "../loading";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";

export default async function ProfilePage() {
  let user: any = null;
  try {
    const session = await getServerSession(nextAuthOptions);
    user = session?.user;
  } catch (err) {
    console.error("getServerSession error in profile:", err);
    user = null;
  }

  // If not logged in, show a gentle message (don't attempt server fetches)
  if (!user?.id) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">プロフィール</h1>
        <p>ログインしてください。</p>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? 3002}`;

  let data: any = [];
  try {
    const response = await fetch(`${baseUrl}/api/purchases/${user.id}`);
    const contentType = response.headers.get("content-type") ?? "";

    if (response.ok && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn("purchases fetch unexpected response:", response.status, text.slice(0, 200));
      data = [];
    }
  } catch (err) {
    console.warn("purchases fetch error:", err);
    data = [];
  }

  // Fetch detail books from microCMS, filter out missing/null results
  const detailBooks = await Promise.all(
    data.map(async (purchase: Purchase) => {
      const res = await getDetailBook(purchase.bookId);
      return res;
    })
  );

  const safeDetailBooks = detailBooks.filter((b): b is BookType => !!b);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user?.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user?.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {safeDetailBooks.map((detailBook: BookType) => (
          <PurchaseProduct key={detailBook.id} detailBook={detailBook} />
        ))}
      </div>
    </div>
  );
}
