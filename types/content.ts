// Content optimization types
export interface ContentOptimization {
  hooks: string[];
  captions: string[];
  seoKeywords: string[];
  hashtags: {
    highVolume: string[];
    niche: string[];
    trending: string[];
    custom: string[];
  };
  thumbnailIdeas: string[];
  titles: string[];
  postingStrategy: {
    bestTime: string;
    bestDay: string;
    frequency: string;
    contentMix: Record<string, number>;
  };
  viralityBoost: string[];
}

export interface PlatformAnalysis {
  platform: string;
  metrics: {
    totalPosts: number;
    avgLikes: number;
    avgComments: number;
    avgShares: number;
    avgEngagementRate: number;
    totalReach: number;
  };
  topPosts: {
    title: string;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  }[];
  trends: {
    date: string;
    likes: number;
    comments: number;
    shares: number;
  }[];
  recommendations: string[];
}
