// Trend Detection Engine — Phase 3 logic converted to TypeScript
// Implements: hashtag frequency, engagement-weighted scoring, TF-IDF,
// peak hours, best days, theme clustering

import {
  hashtagFrequency,
  engagementByHour,
  engagementByDay,
  instagramData,
  youtubeData,
  twitterData,
  formatCount,
} from "@/lib/dataset-loader";
import type { TrendItem, TrendAnalysis, DashboardMetrics } from "@/types/trends";

// ─── Top Hashtags (engagement-weighted) ────────────────────

export function getTopHashtags(platform?: string, limit = 10): TrendItem[] {
  const entries = Object.entries(hashtagFrequency)
    .filter(([, data]) => !platform || platform === "all" || data.platform.toLowerCase() === platform.toLowerCase())
    .map(([tag, data]) => ({
      hashtag: tag,
      platform: data.platform,
      strength: (data.avgEngagement >= 8 ? "High" : data.avgEngagement >= 6 ? "Medium" : "Low") as TrendItem["strength"],
      count: formatCount(data.count),
      engagementScore: data.avgEngagement,
    }))
    .sort((a, b) => b.engagementScore - a.engagementScore);

  return entries.slice(0, limit);
}

// ─── Peak Posting Hours ────────────────────────────────────

export function getPeakHours(topN = 5) {
  return [...engagementByHour]
    .sort((a, b) => b.engagementIndex - a.engagementIndex)
    .slice(0, topN);
}

// ─── Best Posting Days ─────────────────────────────────────

export function getBestDays() {
  return [...engagementByDay].sort((a, b) => b.score - a.score);
}

// ─── TF-IDF Keyword Extraction ─────────────────────────────
// Simplified TF-IDF: compute word frequency across all content,
// inversely weight by how many documents contain the word

export function extractKeywords(limit = 15): { word: string; tfidf: number }[] {
  const allTexts = [
    ...instagramData.posts.map((p) => p.caption),
    ...youtubeData.videos.map((v) => v.title),
    ...twitterData.tweets.map((t) => t.text),
  ];

  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "and", "but", "or", "so", "for", "of",
    "in", "on", "at", "to", "with", "by", "from", "up", "about", "into",
    "this", "that", "these", "those", "it", "its", "my", "your", "our",
    "i", "you", "we", "they", "he", "she", "me", "him", "her", "us",
    "not", "no", "just", "like", "new", "how", "all", "can", "get",
  ]);

  // Term frequency across all docs
  const wordFreq: Record<string, number> = {};
  // Document frequency (how many docs contain the word)
  const docFreq: Record<string, number> = {};

  for (const text of allTexts) {
    const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));
    const uniqueWords = new Set(words);

    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
    for (const word of uniqueWords) {
      docFreq[word] = (docFreq[word] || 0) + 1;
    }
  }

  const totalDocs = allTexts.length;
  const tfidfScores = Object.entries(wordFreq).map(([word, tf]) => {
    const idf = Math.log(totalDocs / (docFreq[word] || 1));
    return { word, tfidf: parseFloat((tf * idf).toFixed(3)) };
  });

  return tfidfScores.sort((a, b) => b.tfidf - a.tfidf).slice(0, limit);
}

// ─── Theme/Category Clustering ─────────────────────────────

export function getThemes(): { theme: string; percentage: number }[] {
  const themes: Record<string, number> = {};
  const allTags = [
    ...instagramData.posts.flatMap((p) => p.hashtags),
    ...youtubeData.videos.flatMap((v) => v.tags),
    ...twitterData.tweets.flatMap((t) => t.hashtags),
  ];

  const themeMap: Record<string, string> = {
    "#AI": "Technology", "#Tech": "Technology", "#Coding": "Technology",
    "#Python": "Technology", "#Innovation": "Technology", "#TechTrends": "Technology",
    "#Startup": "Business", "#Founder": "Business", "#Launch": "Business",
    "#Marketing": "Business", "#Growth": "Business",
    "#Creator": "Content", "#Viral": "Content", "#ContentCreator": "Content",
    "#SocialMedia": "Content", "#Threads": "Content",
    "#Travel": "Lifestyle", "#Food": "Lifestyle", "#Fitness": "Lifestyle",
    "#Routine": "Lifestyle", "#Health": "Lifestyle",
    "#Motivation": "Personal", "#Success": "Personal", "#Hustle": "Personal",
  };

  for (const tag of allTags) {
    const cleanTag = tag.startsWith("#") ? tag : `#${tag}`;
    const theme = themeMap[cleanTag] || "General";
    themes[theme] = (themes[theme] || 0) + 1;
  }

  const total = Object.values(themes).reduce((s, v) => s + v, 0);
  return Object.entries(themes)
    .map(([theme, count]) => ({
      theme,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

// ─── Full Trend Analysis ───────────────────────────────────

export function getFullTrendAnalysis(): TrendAnalysis {
  return {
    topHashtags: getTopHashtags("all", 10),
    engagementTrends: [
      { date: "Mon", engagement: 4200, reach: 18000 },
      { date: "Tue", engagement: 5100, reach: 22000 },
      { date: "Wed", engagement: 6800, reach: 28000 },
      { date: "Thu", engagement: 6200, reach: 25000 },
      { date: "Fri", engagement: 7800, reach: 32000 },
      { date: "Sat", engagement: 9200, reach: 42000 },
      { date: "Sun", engagement: 8100, reach: 36000 },
    ],
    peakHours: getPeakHours(5),
    bestDays: getBestDays(),
    keywords: extractKeywords(10),
    themes: getThemes(),
  };
}

// ─── Dashboard Metrics ─────────────────────────────────────

export function getDashboardMetrics(): DashboardMetrics {
  const topHashtags = getTopHashtags("all", 10);
  const peakHour = getPeakHours(1)[0];

  // Aggregate engagement
  const totalEngagement = instagramData.posts.reduce(
    (s, p) => s + p.likes + p.comments + p.shares, 0
  );

  return {
    trendingTopics: {
      value: topHashtags.length.toString(),
      change: "+12%",
    },
    viralScore: {
      value: "82",
      change: "+5%",
    },
    engagement: {
      value: formatCount(totalEngagement),
      change: "+18%",
    },
    bestPostingTime: {
      value: peakHour.label,
      label: "peak hour",
    },
    sparklineData: [40, 45, 38, 52, 48, 61, 72, 68, 75, 82],
  };
}
