import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

// 定义主题的接口
interface Topic {
   _id: string;
   title: string;
   description: string;
}

// 将数据获取逻辑移到一个单独的函数中
async function getTopics(): Promise<Topic[]> {
   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
   try {
      const res = await fetch(`${apiUrl}/api/topics`, {
         cache: "no-store",
         headers: {
            "Content-Type": "application/json",
         },
      });

      if (!res.ok) {
         throw new Error(`Failed to fetch topics: ${res.status}`);
      }

      const data = await res.json();
      return data.topics || [];
   } catch (error) {
      console.error("Error loading topics:", error);
      throw error; // 重新抛出错误，让调用者处理
   }
}

export default async function TopicsList() {
   try {
      const topics = await getTopics();

      if (topics.length === 0) {
         return <p>No topics found.</p>;
      }

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
   } catch (error) {
      console.error("Error in TopicsList:", error);
      return <p>Error loading topics. Please try again later.</p>;
   }
}
