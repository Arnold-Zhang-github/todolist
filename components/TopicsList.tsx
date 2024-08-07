'use client';  // 添加这行来标记为客户端组件

import { useState, useEffect } from 'react';
import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";
import { getApiUrl } from '../utils/api';

interface Topic {
  _id: string;
  title: string;
  description: string;
}

export default function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const apiUrl = getApiUrl();
        console.log('Fetching topics from:', `${apiUrl}/api/topics`);
        const res = await fetch(`${apiUrl}/api/topics`);
        if (!res.ok) {
          throw new Error(`Failed to fetch topics: ${res.status}`);
        }
        const data = await res.json();
        console.log('Fetched topics:', data);
        setTopics(data.topics || []);
      } catch (error) {
        console.error("Error loading topics:", error);
        setError("Failed to load topics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopics();
  }, []);

  if (isLoading) return <p>Loading topics...</p>;
  if (error) return <p>{error}</p>;
  if (topics.length === 0) return <p>No topics found.</p>;

  return (
    <>
      {topics.map((t: Topic) => (
        <div
          key={t._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <h2 className="font-bold text-2xl">{t.title}</h2>
            <div>{t.description}</div>
          </div>

          <div className="flex gap-2">
            <RemoveBtn id={t._id} />
            <Link href={`/editTopic/${t._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
