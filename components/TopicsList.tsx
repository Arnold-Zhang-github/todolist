import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";
import { headers } from 'next/headers';
const getTopics = async () => {
   try {
      // 获取当前请求的 host
      const host = headers().get('host') || 'localhost:3000';
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      
      const res = await fetch(`${protocol}://${host}/api/topics`, {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error("Failed to fetch topics");
      }

      return res.json();
   } catch (error) {
      console.error("Error loading topics:", error);
      return { topics: [] };
   }
};

export default async function TopicsList() {
   const { topics = [] } = await getTopics();

   if (topics.length === 0) {
      return <p>No topics found.</p>;
   }

   return (
      <>
         {topics.map((t: { _id: string; title: string; description: string }) => (
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