import connectDB from "@/config/db";
import LoginFailureSummary from "@/models/LoginFailureSummary";
import { NextRequest, NextResponse } from "next/server";

// import { createStripeCustomer } from "@/configs/stripe";

export async function GET(request: NextRequest) {
  try {
    const startDate = request.nextUrl.searchParams.get("startDate");
    const endDate = request.nextUrl.searchParams.get("endDate");
    await connectDB();

    console.log("Got here", startDate, endDate);

    const query = {
      timestamp: {
        $gte: startDate ? new Date(startDate) : null,
        $lte: endDate ? new Date(endDate) : null,
      },
    };

    const loginFailures = await LoginFailureSummary.find(query)
      .limit(100)
      .sort({ timestamp: 1 });

    console.log(loginFailures);

    return NextResponse.json(
      { loginFailures },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status: 500,
      }
    );
  }
}
