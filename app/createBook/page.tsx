"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const CreateBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<any>(null);

  const onSubmit = async (data: any) => {
    const { title, content, price } = data;

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];
    const imageFileName = file.name;

    const formData = new FormData();
    formData.append("file", file); // ファイルオブジェクトを追加

    const imageUploadResponse = await fetch(`/api/thumbnail/upload?filename=${imageFileName}`, {
      method: "POST",
      body: formData,
    });

    const imageUploadContentType = imageUploadResponse.headers.get("content-type") ?? "";
    let imageUrlData: any = {};
    if (imageUploadResponse.ok && imageUploadContentType.includes("application/json")) {
      imageUrlData = await imageUploadResponse.json();
    } else {
      const text = await imageUploadResponse.text();
      throw new Error("thumbnail upload failed: " + imageUploadResponse.status + " " + text.slice(0, 200));
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        price,
        thumbnailUrl: imageUrlData.imageUrl,
      }),
    });

    const respContentType = response.headers.get("content-type") ?? "";
    let result: any = {};
    if (response.ok && respContentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      throw new Error("create book failed: " + response.status + " " + text.slice(0, 200));
    }

    setBlob(result);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 container mx-auto">
      <div>
        <label htmlFor="title">書籍タイトル</label>
        <input
          id="title"
          {...register("title", { required: true })}
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.title && (
          <p className="text-red-500 font-medium">Title is required.</p>
        )}
      </div>

      <div>
        <label htmlFor="content">執筆</label>
        <textarea
          id="content"
          {...register("content", { required: true })}
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.content && (
          <p className="text-red-500 font-medium">Content is required.</p>
        )}
      </div>

      <div>
        <label htmlFor="price">価格設定</label>
        <input
          id="price"
          type="number"
          {...register("price", { required: true })}
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.price && (
          <p className="text-red-500 font-medium">Price is required.</p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="image">サムネイル</label>
        <input ref={inputFileRef} type="file" id="image" name="file" required />
        {errors.image && (
          <p className="text-red-500 font-medium">Price is required.</p>
        )}
        {blob && (
          <div>
            Blob url: <a href={blob.url}>{blob.url}</a>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-400 px-6 py-3 font-medium rounded-md text-white shadow-sm mt-4"
      >
        Create Book
      </button>
    </form>
  );
};

export default CreateBook;
