import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";
import Cors from 'cors';

// 初始化 CORS 中间件
const cors = Cors({
  methods: ['GET', 'PUT'],
  origin: process.env.NEXT_PUBLIC_FRONTEND_URL || '*', // 使用环境变量或允许所有源
});

// 辅助函数来运行中间件
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function PUT(request, { params }) {
  await runMiddleware(request, NextResponse, cors);

  console.log("PUT request received for topic ID:", params.id);
  try {
    const { id } = params;
    const { title, description } = await request.json();
    
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB");

    console.log("Updating topic:", id);
    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedTopic) {
      console.log("Topic not found:", id);
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    console.log("Topic updated successfully:", updatedTopic);
    return NextResponse.json({ message: "Topic updated", topic: updatedTopic }, { status: 200 });
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  await runMiddleware(request, NextResponse, cors);

  console.log("GET request received for topic ID:", params.id);
  try {
    const { id } = params;
    
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB");

    console.log("Fetching topic:", id);
    const topic = await Topic.findById(id);

    if (!topic) {
      console.log("Topic not found:", id);
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    console.log("Topic fetched successfully:", topic);
    return NextResponse.json(topic, { status: 200 });
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 });
  }
}