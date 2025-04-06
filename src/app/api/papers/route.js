import { NextResponse } from "next/server";
import { getPapers } from "../../utils"; // go one level up from api/

export const revalidate = 600; // Cache for 10 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame");
  console.log("Time frame received:", timeFrame);

  const papers = await getPapers(timeFrame);

  return NextResponse.json(papers, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=59',
    },
  });
}
