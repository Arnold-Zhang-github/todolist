// components/EditTopicForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from '../utils/api';

export default function EditTopicForm({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/topics/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update topic");
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log("Error updating topic", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setNewTitle(e.target.value)}
        value={newTitle}
        className="border border-blue-500 px-8 py-2"
        type="text"
        placeholder="Topic Title"
      />

      <input
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
        className="border border-blue-500 px-8 py-2"
        type="text"
        placeholder="Topic Description"
      />

      <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
        Update Topic
      </button>
    </form>
  );
}