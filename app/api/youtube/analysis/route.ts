// YouTube Analysis API — analytics from dataset
import { NextResponse } from "next/server";
import { youtubeData, formatCount } from "@/lib/dataset-loader";

export async function GET() {
  try {
    const videos = youtubeData.videos;

    const totalViews = videos.reduce((s, v) => s + v.views, 0);
    const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
    const totalComments = videos.reduce((s, v) => s + v.comments, 0);
    const avgDuration = Math.round(videos.reduce((s, v) => s + v.duration, 0) / videos.length);

    const topVideos = [...videos]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((v) => ({
        title: v.title,
        views: v.views,
        likes: v.likes,
        comments: v.comments,
        category: v.category,
        engagementRate: parseFloat(((v.likes + v.comments) / v.views * 100).toFixed(2)),
      }));

    const categoryMap: Record<string, number> = {};
    for (const v of videos) {
      categoryMap[v.category] = (categoryMap[v.category] || 0) + 1;
    }
    const categories = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      value: Math.round((count / videos.length) * 100),
    }));

    return NextResponse.json({
      success: true,
      data: {
        platform: "YouTube",
        metrics: {
          totalVideos: videos.length,
          totalViews,
          totalLikes,
          totalComments,
          avgViews: Math.round(totalViews / videos.length),
          avgDuration,
          avgEngagementRate: parseFloat(((totalLikes + totalComments) / totalViews * 100).toFixed(2)),
        },
        topVideos,
        categories,
        formattedMetrics: {
          totalViews: formatCount(totalViews),
          totalLikes: formatCount(totalLikes),
          totalComments: formatCount(totalComments),
          avgDuration: `${Math.floor(avgDuration / 60)}:${(avgDuration % 60).toString().padStart(2, "0")}`,
        },
      },
    });
  } catch (error: unknown) {
    console.error("YouTube analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze YouTube data" },
      { status: 500 }
    );
  }
}
