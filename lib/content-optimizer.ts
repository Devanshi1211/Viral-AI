// Content Optimizer — Phase 5 structured optimization engine
// Returns platform-specific recommendations in clean JSON format

import { generateText } from "@/lib/gemini";
import type { ContentOptimization } from "@/types/content";

// ─── Structured Content Prompt ─────────────────────────────

function buildOptimizationPrompt(
  topic: string,
  platform: string,
  audience: string,
  tone: string
): string {
  return `You are a world-class content strategist and viral marketing expert.

Generate a complete content optimization package for:
Topic: "${topic}"
Platform: ${platform}
Target Audience: ${audience}
Tone: ${tone}

Return EXACTLY in this structured format — each section on separate lines:

HOOKS:
1. [attention-grabbing hook 1]
2. [attention-grabbing hook 2]
3. [attention-grabbing hook 3]
4. [attention-grabbing hook 4]
5. [attention-grabbing hook 5]

CAPTIONS:
1. [full caption with CTA and emojis]
2. [full caption with CTA and emojis]
3. [full caption with CTA and emojis]

SEO_KEYWORDS:
[keyword1], [keyword2], [keyword3], [keyword4], [keyword5], [keyword6], [keyword7], [keyword8], [keyword9], [keyword10]

HASHTAGS_HIGH:
[hashtag1] [hashtag2] [hashtag3] [hashtag4] [hashtag5]

HASHTAGS_NICHE:
[hashtag1] [hashtag2] [hashtag3] [hashtag4] [hashtag5]

HASHTAGS_TRENDING:
[hashtag1] [hashtag2] [hashtag3] [hashtag4] [hashtag5]

THUMBNAIL_IDEAS:
1. [visual thumbnail concept]
2. [visual thumbnail concept]
3. [visual thumbnail concept]

TITLES:
1. [optimized title]
2. [optimized title]
3. [optimized title]
4. [optimized title]
5. [optimized title]

VIRALITY_BOOST:
1. [specific actionable tip]
2. [specific actionable tip]
3. [specific actionable tip]
4. [specific actionable tip]
5. [specific actionable tip]

Rules:
- Make everything specific to the topic, not generic
- Use power words and curiosity gaps
- Keep each hook under 15 words
- Captions should be ready to post
- Hashtags should start with #
- Titles should be under 60 characters`;
}

// ─── Parse Structured Response ─────────────────────────────

function parseLines(text: string, startKey: string, endKey?: string): string[] {
  const startIdx = text.indexOf(startKey);
  if (startIdx === -1) return [];

  let section: string;
  if (endKey) {
    const endIdx = text.indexOf(endKey, startIdx + startKey.length);
    section = endIdx > -1
      ? text.substring(startIdx + startKey.length, endIdx)
      : text.substring(startIdx + startKey.length);
  } else {
    section = text.substring(startIdx + startKey.length);
  }

  return section
    .split("\n")
    .map((l) => l.replace(/^\d+[\.\)]\s*/, "").replace(/^\*+\s*/, "").replace(/^\-\s*/, "").trim())
    .filter((l) => l.length > 3);
}

function parseCommaSeparated(text: string, key: string, nextKey?: string): string[] {
  const startIdx = text.indexOf(key);
  if (startIdx === -1) return [];

  let section: string;
  if (nextKey) {
    const endIdx = text.indexOf(nextKey, startIdx);
    section = endIdx > -1
      ? text.substring(startIdx + key.length, endIdx)
      : text.substring(startIdx + key.length);
  } else {
    section = text.substring(startIdx + key.length);
  }

  return section
    .replace(/\n/g, " ")
    .split(/[,\s]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2);
}

// ─── Main Optimizer Function ───────────────────────────────

export async function optimizeContent(
  topic: string,
  platform = "Instagram",
  audience = "General",
  tone = "engaging"
): Promise<ContentOptimization> {
  const prompt = buildOptimizationPrompt(topic, platform, audience, tone);
  const text = await generateText(prompt);

  const hooks = parseLines(text, "HOOKS:", "CAPTIONS:").slice(0, 5);
  const captions = parseLines(text, "CAPTIONS:", "SEO_KEYWORDS:").slice(0, 3);
  const seoKeywords = parseCommaSeparated(text, "SEO_KEYWORDS:", "HASHTAGS_HIGH:").slice(0, 10);
  const highVolume = parseCommaSeparated(text, "HASHTAGS_HIGH:", "HASHTAGS_NICHE:").slice(0, 5);
  const niche = parseCommaSeparated(text, "HASHTAGS_NICHE:", "HASHTAGS_TRENDING:").slice(0, 5);
  const trending = parseCommaSeparated(text, "HASHTAGS_TRENDING:", "THUMBNAIL_IDEAS:").slice(0, 5);
  const thumbnailIdeas = parseLines(text, "THUMBNAIL_IDEAS:", "TITLES:").slice(0, 3);
  const titles = parseLines(text, "TITLES:", "VIRALITY_BOOST:").slice(0, 5);
  const viralityBoost = parseLines(text, "VIRALITY_BOOST:").slice(0, 5);

  // Platform-specific posting strategy
  const postingStrategy = getPostingStrategy(platform);

  return {
    hooks: hooks.length > 0 ? hooks : ["Hook generation in progress..."],
    captions: captions.length > 0 ? captions : ["Caption generation in progress..."],
    seoKeywords: seoKeywords.length > 0 ? seoKeywords : [topic.toLowerCase()],
    hashtags: {
      highVolume: highVolume.length > 0 ? highVolume : ["#trending"],
      niche: niche.length > 0 ? niche : ["#niche"],
      trending: trending.length > 0 ? trending : ["#viral"],
      custom: [`#${topic.replace(/\s+/g, "").toLowerCase()}`],
    },
    thumbnailIdeas,
    titles,
    postingStrategy,
    viralityBoost,
  };
}

// ─── Platform-Specific Posting Strategy ────────────────────

function getPostingStrategy(platform: string) {
  const strategies: Record<string, ContentOptimization["postingStrategy"]> = {
    Instagram: {
      bestTime: "6:00 PM - 9:00 PM",
      bestDay: "Saturday",
      frequency: "1-2 posts/day, 5-8 Stories/day",
      contentMix: { Reels: 40, Carousel: 30, Stories: 20, "Feed Posts": 10 },
    },
    YouTube: {
      bestTime: "2:00 PM - 6:00 PM",
      bestDay: "Friday",
      frequency: "2-3 videos/week",
      contentMix: { "Long-form": 50, Shorts: 30, "Live Streams": 20 },
    },
    Twitter: {
      bestTime: "8:00 AM - 11:00 AM",
      bestDay: "Tuesday",
      frequency: "3-5 tweets/day",
      contentMix: { Threads: 30, "Single Tweets": 40, Polls: 15, Quotes: 15 },
    },
  };

  return strategies[platform] || strategies["Instagram"];
}
