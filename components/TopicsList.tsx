import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

const getTopics = async () => {
   try {
      // 使用环境变量或默认值来设置 API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/topics`, {
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