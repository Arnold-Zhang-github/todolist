import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";

// CORS 预检请求处理
export async function OPTIONS(request) {
  return NextResponse.json({}, { 
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// 辅助函数：添加 CORS 头
function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function POST(request) {
  console.log("POST request received to create a new topic");
  try {
    const { title, description } = await request.json();
    console.log("Received data:", { title, description });

    if (!title || !description) {
      console.log("Invalid data: Title and description are required");
      return addCorsHeaders(NextResponse.json({ error: "Title and description are required" }, { status: 400 }));
    }

    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB");

    console.log("Creating new topic...");
    const newTopic = await Topic.create({ title, description });
    console.log("New topic created:", newTopic);

    return addCorsHeaders(NextResponse.json({ message: "Topic created", topic: newTopic }, { status: 201 }));
  } catch (error) {
    console.error("Error in POST /api/topics:", error);
    return addCorsHeaders(NextResponse.json({ error: "An error occurred while creating the topic" }, { status: 500 }));
  }
}

export async function GET(request) {
  console.log("GET request received to fetch all topics");
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB");

    console.log("Fetching all topics...");
    const topics = await Topic.find();
    console.log("Fetched topics count:", topics.length);

    return addCorsHeaders(NextResponse.json({ topics }));
  } catch (error) {
    console.error("Error in GET /api/topics:", error);
    return addCorsHeaders(NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 }));
  }
}

export async function DELETE(request) {
  console.log("DELETE request received");
  try {
    const id = request.nextUrl.searchParams.get("id");
    console.log("Deleting topic with ID:", id);

    if (!id) {
      console.log("No ID provided for deletion");
      return addCorsHeaders(NextResponse.json({ error: "No ID provided" }, { status: 400 }));
    }

    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB");

    const deletedTopic = await Topic.findByIdAndDelete(id);
    
    if (!deletedTopic) {
      console.log("Topic not found for deletion:", id);
      return addCorsHeaders(NextResponse.json({ error: "Topic not found" }, { status: 404 }));
    }

    console.log("Topic deleted successfully:", id);
    return addCorsHeaders(NextResponse.json({ message: "Topic deleted" }, { status: 200 }));
  } catch (error) {
    console.error("Error in DELETE /api/topics:", error);
    return addCorsHeaders(NextResponse.json({ error: "An error occurred while deleting the topic" }, { status: 500 }));
  }
}