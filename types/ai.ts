// TypeScript types for AI-related data structures

export interface AIResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface GenerateRequest {
  prompt: string;
  model?: string;
}

export interface ContentRequest {
  topic: string;
  tone?: string;
  style?: string;
  niche?: string;
}

export interface ContentPlanRequest {
  niche: string;
  platforms: string[];
  days?: number;
}

export interface YouTubeDescriptionRequest {
  topic: string;
  title: string;
}
