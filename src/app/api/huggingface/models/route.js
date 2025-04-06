import { NextResponse } from "next/server";

export const revalidate = 600; // Cache for 10 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame");
  const limit = searchParams.get("limit") || "10";
  
  try {
    const proxyUrl = "https://fetch-url.onrender.com/fetch-url";
    const targetUrl = `https://huggingface.co/api/trending?limit=${limit}&type=model`;
    
    const response = await fetch(`${proxyUrl}?isapi=1&url=${encodeURIComponent(targetUrl)}`);
    const data = await response.json();
    
    // Extract and transform the important data
    const transformedData = data.content.recentlyTrending.map(item => {
      const { repoData } = item;
      return {
        modelId: repoData.id,
        author: repoData.author,
        authorAvatar: repoData.authorData.avatarUrl,
        downloads: repoData.downloads,
        likes: repoData.likes,
        lastModified: repoData.lastModified,
        pipelineTag: repoData.pipeline_tag,
        isPrivate: repoData.private,
        isGated: repoData.gated
      };
    });
    
    return NextResponse.json({ models: transformedData }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}