import { NextRequest, NextResponse } from "next/server";
import { checkInterviewLimit } from "@/lib/actions/interview-limit.action";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await checkInterviewLimit(userId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error checking interview limit:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check interview limit" },
      { status: 500 }
    );
  }
}
