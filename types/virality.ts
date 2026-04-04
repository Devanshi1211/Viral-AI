// Virality prediction types
export interface ViralityInput {
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
  captionLength: number;
  hashtagsCount: number;
  postingHour: number;
  engagementRate: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ViralityResult {
  predictedScore: number;
  label: "Low" | "Mid" | "High" | "Viral";
  modelUsed: string;
  metrics: {
    r2: number;
    mae: number;
    rmse: number;
  };
  featureImportance: FeatureImportance[];
  explanation: string[];
  distribution: {
    low: number;
    mid: number;
    high: number;
    viral: number;
  };
}
