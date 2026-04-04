// Trend detection types
export interface TrendItem {
  hashtag: string;
  platform: string;
  strength: "High" | "Medium" | "Low";
  count: string;
  engagementScore: number;
}

export interface PeakHour {
  hour: number;
  label: string;
  engagementIndex: number;
}

export interface TrendAnalysis {
  topHashtags: TrendItem[];
  engagementTrends: { date: string; engagement: number; reach: number }[];
  peakHours: PeakHour[];
  bestDays: { day: string; score: number }[];
  keywords: { word: string; tfidf: number }[];
  themes: { theme: string; percentage: number }[];
}

export interface DashboardMetrics {
  trendingTopics: { value: string; change: string };
  viralScore: { value: string; change: string };
  engagement: { value: string; change: string };
  bestPostingTime: { value: string; label: string };
  sparklineData: number[];
}
