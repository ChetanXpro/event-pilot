import connectDB from "@/config/db";
import LoginFailureSummary from "@/models/LoginFailureSummary";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const sixtyMinutesAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const startDate =
      request.nextUrl.searchParams.get("startDate") || sixtyMinutesAgo;
    const endDate = request.nextUrl.searchParams.get("endDate") || now;

    await connectDB();

    const query = {
      timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    const loginFailures = await LoginFailureSummary.find(query)
      .limit(100)
      .sort({ timestamp: 1 });

    console.log("loginFailures", loginFailures);

    return NextResponse.json(loginFailures, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
