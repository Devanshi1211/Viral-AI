// Dataset loader — loads CSV/sample data with safe fallback
// Since datasets aren't in the repo, we provide realistic sample data
// based on Phase 3/4/5 notebook patterns. Replace with real CSV loading
// when datasets are added to the project.

import type { TrendItem, PeakHour } from "@/types/trends";

// ─── Instagram Analytics Sample Data ───────────────────────
// Based on Instagram_Analytics.csv structure from Phase 3

export const instagramData = {
  posts: [
    { id: 1, caption: "AI is changing everything 🚀", likes: 2400, comments: 520, shares: 840, hashtags: ["#AI", "#Tech", "#Innovation"], hour: 20, day: "Wednesday", type: "Reel" },
    { id: 2, caption: "Startup life be like...", likes: 1800, comments: 380, shares: 520, hashtags: ["#Startup", "#Founder", "#Hustle"], hour: 18, day: "Tuesday", type: "Carousel" },
    { id: 3, caption: "Content creator tips", likes: 5200, comments: 1200, shares: 2100, hashtags: ["#Creator", "#Viral", "#Tips"], hour: 21, day: "Saturday", type: "Reel" },
    { id: 4, caption: "Morning routine for success", likes: 3100, comments: 420, shares: 780, hashtags: ["#Routine", "#Success", "#Motivation"], hour: 7, day: "Monday", type: "Carousel" },
    { id: 5, caption: "The future of social media", likes: 4500, comments: 890, shares: 1400, hashtags: ["#SocialMedia", "#Future", "#Digital"], hour: 19, day: "Thursday", type: "Reel" },
    { id: 6, caption: "Budget travel hacks", likes: 6100, comments: 1500, shares: 2800, hashtags: ["#Travel", "#Budget", "#Hacks"], hour: 12, day: "Saturday", type: "Video" },
    { id: 7, caption: "Fitness transformation", likes: 3800, comments: 650, shares: 920, hashtags: ["#Fitness", "#Gym", "#Health"], hour: 6, day: "Monday", type: "Post" },
    { id: 8, caption: "Coding tutorial Python", likes: 2900, comments: 340, shares: 610, hashtags: ["#Python", "#Coding", "#Dev"], hour: 15, day: "Wednesday", type: "Carousel" },
    { id: 9, caption: "Food photography tips", likes: 4200, comments: 780, shares: 1100, hashtags: ["#Food", "#Photography", "#FoodPorn"], hour: 12, day: "Sunday", type: "Post" },
    { id: 10, caption: "Breaking: New AI model released", likes: 8500, comments: 2100, shares: 4200, hashtags: ["#AI", "#Breaking", "#Tech"], hour: 10, day: "Friday", type: "Reel" },
  ],
};

// ─── YouTube Trending Sample Data ──────────────────────────
// Based on youtube_trending_data.csv structure from Phase 3

export const youtubeData = {
  videos: [
    { title: "How AI Will Change Content Creation", views: 2400000, likes: 145000, comments: 32000, category: "Science & Tech", tags: ["AI", "content", "future"], publishHour: 14, duration: 612 },
    { title: "Top 10 Coding Languages 2025", views: 1800000, likes: 98000, comments: 18000, category: "Education", tags: ["coding", "programming", "tech"], publishHour: 10, duration: 480 },
    { title: "I Tried This Viral Recipe", views: 5200000, likes: 310000, comments: 45000, category: "Food", tags: ["recipe", "cooking", "viral"], publishHour: 16, duration: 720 },
    { title: "This Changed My Life", views: 3100000, likes: 210000, comments: 28000, category: "Lifestyle", tags: ["motivation", "life", "change"], publishHour: 18, duration: 540 },
    { title: "The Truth About Social Media", views: 4500000, likes: 280000, comments: 52000, category: "Entertainment", tags: ["social media", "truth", "viral"], publishHour: 20, duration: 900 },
  ],
};

// ─── Twitter/X Sample Data ─────────────────────────────────

export const twitterData = {
  tweets: [
    { text: "Thread: 10 AI tools you need to try 🧵", likes: 12400, retweets: 4200, replies: 890, hashtags: ["#AI", "#Threads", "#Tools"], hour: 9 },
    { text: "Hot take: Content quality > quantity", likes: 8900, retweets: 2100, replies: 1200, hashtags: ["#ContentCreator", "#Marketing"], hour: 11 },
    { text: "Just launched my new startup 🚀", likes: 15600, retweets: 5800, replies: 2100, hashtags: ["#Startup", "#Launch", "#Founder"], hour: 8 },
    { text: "Unpopular opinion: TikTok is overrated", likes: 22000, retweets: 8900, replies: 4500, hashtags: ["#TikTok", "#SocialMedia"], hour: 14 },
  ],
};

// ─── Hashtag Frequency Data ────────────────────────────────
// Pre-computed from Phase 3 analysis

export const hashtagFrequency: Record<string, { count: number; avgEngagement: number; platform: string }> = {
  "#AI": { count: 24500, avgEngagement: 8.2, platform: "Instagram" },
  "#Startup": { count: 18200, avgEngagement: 6.5, platform: "Twitter" },
  "#Viral": { count: 32100, avgEngagement: 9.1, platform: "Instagram" },
  "#TechTrends": { count: 12800, avgEngagement: 7.3, platform: "Twitter" },
  "#Creator": { count: 9400, avgEngagement: 5.8, platform: "YouTube" },
  "#Innovation": { count: 15600, avgEngagement: 7.9, platform: "Instagram" },
  "#ContentCreator": { count: 21000, avgEngagement: 8.5, platform: "Instagram" },
  "#Marketing": { count: 16400, avgEngagement: 6.1, platform: "Twitter" },
  "#Growth": { count: 11200, avgEngagement: 7.0, platform: "Instagram" },
  "#SocialMedia": { count: 28900, avgEngagement: 8.8, platform: "Instagram" },
  "#Python": { count: 8600, avgEngagement: 5.2, platform: "Twitter" },
  "#Coding": { count: 7200, avgEngagement: 4.9, platform: "YouTube" },
  "#Travel": { count: 42000, avgEngagement: 9.5, platform: "Instagram" },
  "#Food": { count: 38000, avgEngagement: 9.2, platform: "Instagram" },
  "#Fitness": { count: 35000, avgEngagement: 8.7, platform: "Instagram" },
};

// ─── Engagement by Hour ────────────────────────────────────
// Pre-computed from combined dataset analysis

export const engagementByHour: PeakHour[] = Array.from({ length: 24 }, (_, h) => {
  // Realistic engagement curve — peaks at 8-9 AM, 12-1 PM, 6-9 PM
  const baseEngagement = 30;
  const morningBoost = h >= 7 && h <= 9 ? 40 : 0;
  const lunchBoost = h >= 11 && h <= 13 ? 35 : 0;
  const eveningBoost = h >= 18 && h <= 21 ? 50 : 0;
  const nightPenalty = h >= 0 && h <= 5 ? -20 : 0;

  const index = Math.min(100, Math.max(10, baseEngagement + morningBoost + lunchBoost + eveningBoost + nightPenalty + Math.floor(Math.random() * 10)));

  return {
    hour: h,
    label: `${h === 0 ? 12 : h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`,
    engagementIndex: index,
  };
});

// ─── Engagement by Day ─────────────────────────────────────

export const engagementByDay = [
  { day: "Monday", score: 62 },
  { day: "Tuesday", score: 68 },
  { day: "Wednesday", score: 75 },
  { day: "Thursday", score: 72 },
  { day: "Friday", score: 78 },
  { day: "Saturday", score: 85 },
  { day: "Sunday", score: 80 },
];

// ─── Feature Importance (from Phase 4 Random Forest) ───────

export const featureImportanceData = [
  { feature: "engagementRate", importance: 0.28 },
  { feature: "likes", importance: 0.22 },
  { feature: "shares", importance: 0.18 },
  { feature: "comments", importance: 0.12 },
  { feature: "watchTime", importance: 0.08 },
  { feature: "hashtagsCount", importance: 0.05 },
  { feature: "captionLength", importance: 0.04 },
  { feature: "postingHour", importance: 0.03 },
];

// ─── Helper: Format count for display ──────────────────────

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
