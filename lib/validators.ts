// Input validation schemas — har route ke liye clean validation
import { z } from "zod";

// Generic prompt validation
export const promptSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

// Instagram captions
export const instagramCaptionSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  tone: z.string().optional().default("engaging"),
});

// Instagram hashtags
export const instagramHashtagSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  niche: z.string().optional().default("general"),
});

// YouTube titles
export const youtubeTitleSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

// YouTube descriptions
export const youtubeDescriptionSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  title: z.string().min(1, "Video title is required"),
});

// Twitter posts
export const twitterPostSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  style: z.string().optional().default("informative"),
});

// Trend analysis
export const trendSchema = z.object({
  niche: z.string().min(1, "Niche is required"),
});

// Content plan
export const contentPlanSchema = z.object({
  niche: z.string().min(1, "Niche is required"),
  platforms: z
    .array(z.string())
    .min(1, "At least one platform is required")
    .default(["instagram", "youtube"]),
  days: z.number().min(1).max(30).optional().default(7),
});

// Virality score
export const viralitySchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  platform: z.string().optional().default("Instagram"),
});

