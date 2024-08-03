import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";

export async function POST(request) {
   try {
      const { title, description } = await request.json();

      if (!title || !description) {
         return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
      }

      await connectMongoDB();
      const newTopic = await Topic.create({ title, description });

      return NextResponse.json({ message: "Topic created", topic: newTopic }, { status: 201 });
   } catch (error) {
      console.error("Error in POST /api/topics:", error);
      return NextResponse.json({ error: "An error occurred while creating the topic" }, { status: 500 });
   }
}

export async function GET() {
   await connectMongoDB();
   const topics = await Topic.find();
   return NextResponse.json({ topics });
}

export async function DELETE(request) {
   const id = request.nextUrl.searchParams.get("id");
   await connectMongoDB();
   await Topic.findByIdAndDelete(id);
   return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
}
