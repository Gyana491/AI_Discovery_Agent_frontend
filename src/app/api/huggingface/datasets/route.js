import { NextResponse } from "next/server";

export const revalidate = 600; // Cache for 10 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame");
  const limit = searchParams.get("limit") || "10";
  
  try {
    const proxyUrl = "https://fetch-url.onrender.com/fetch-url";
    const targetUrl = `https://huggingface.co/api/trending?limit=${limit}&type=dataset`;
    
    const response = await fetch(`${proxyUrl}?isapi=1&url=${encodeURIComponent(targetUrl)}`);
    const data = await response.json();
    
    // Make sure we're returning the correct structure even if the response is empty
    return NextResponse.json({
      recentlyTrending: data?.content?.recentlyTrending || []
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 });
  }
}