// components/AddTopic.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from '@/utils/api';

export default function AddTopic() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!title || !description) {
      setError("Title and description are required.");
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/topics`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create a topic");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      setError(error.message || "An error occurred while creating the topic.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Title"
        disabled={isLoading}
      />

      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Description"
        disabled={isLoading}
      />

      <button
        type="submit"
        className="bg-green-600 font-bold text-white py-3 px-6 w-fit disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Topic"}
      </button>
    </form>
  );
}