import { notFound } from "next/navigation";
import EditTopicForm from "@/components/EditTopicForm";

const getTopicById = async (id: string) => {
   try {
      const res = await fetch(`http://localhost:3000/api/topics/${id}`, {
         cache: "no-store",
         next: { revalidate: 0 },
      });

      if (!res.ok) {
         if (res.status === 404) {
            return null;
         }
         throw new Error("Failed to fetch topic data");
      }

      return res.json();
   } catch (error) {
      console.error("Error loading topic:", error);
      throw error;
   }
};

export default async function EditTopic({
   params,
}: {
   params: { id: string };
}) {
   const { id } = params;
   console.log("Fetching topic with id:", id);

   try {
      const topic = await getTopicById(id);

      if (!topic) {
         notFound();
      }

      const { title, description } = topic;

      return <EditTopicForm id={id} title={title} description={description} />;
   } catch (error) {
      console.error("Error in EditTopic component:", error);
      return <div>Error: Failed to load topic. Please try again later.</div>;
   }
}