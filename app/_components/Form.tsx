/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { addAdmin } from "@/actions/actions";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function Form() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [state, addAction, isLoading] = useActionState(addAdmin, undefined);

  if (!state?.success) {
    console.log(state?.errors);
  }

  return (
    <form
      action={addAction}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded-lg"
    >
      <label className="flex flex-col">
        Name:
        <input
          type="text"
          value={name}
          name="name"
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          placeholder="Enter your name"
        />
      </label>

      <label className="flex flex-col">
        Upload Image:
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>
      <Link href="/admins" className="p-4 bg-red-400">
        admins
      </Link>
    </form>
  );
}
