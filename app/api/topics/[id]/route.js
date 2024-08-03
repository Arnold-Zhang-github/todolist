import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { title, description } = await request.json();
        
        await connectMongoDB();
        
        const updatedTopic = await Topic.findByIdAndUpdate(
            id, 
            { title, description },
            { new: true, runValidators: true }
        );

        if (!updatedTopic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Topic updated", topic: updatedTopic }, { status: 200 });
    } catch (error) {
        console.error("Error updating topic:", error);
        return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        await connectMongoDB();
        const topic = await Topic.findById(id);

        if (!topic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }

        return NextResponse.json(topic, { status: 200 });
    } catch (error) {
        console.error("Error fetching topic:", error);
        return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 });
    }
}