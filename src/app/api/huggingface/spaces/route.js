import { NextResponse } from "next/server";

export const revalidate = 600; // Cache for 10 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame");
  const limit = searchParams.get("limit") || "10";
  
  try {
    const proxyUrl = "https://fetch-url.onrender.com/fetch-url";
    const targetUrl = `https://huggingface.co/api/trending?limit=${limit}&type=space`;
    
    const response = await fetch(`${proxyUrl}?isapi=1&url=${encodeURIComponent(targetUrl)}`);
    const data = await response.json();
    
    // Extract the recentlyTrending array from the nested response
    const spaces = data?.content?.recentlyTrending || [];
    
    // Map the spaces to a minimal structure with only essential data
    const formattedSpaces = spaces.map(({ repoData }) => ({
      id: repoData.id,
      title: repoData.title || repoData.id.split('/')[1],
      author: repoData.author,
      authorAvatar: repoData.authorData.avatarUrl,
      description: repoData.shortDescription || repoData.ai_short_description,
      emoji: repoData.emoji,
      likes: repoData.likes,
      lastModified: repoData.lastModified,
      domains: repoData.runtime?.domains?.[0]?.domain // Only grab first domain if available
    }));

    return NextResponse.json(formattedSpaces, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return NextResponse.json({ error: "Failed to fetch spaces" }, { status: 500 });
  }
}