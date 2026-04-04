// Centralized prompt templates — har route ke liye clean, reusable prompts

// ─── Instagram ─────────────────────────────────────────────

export function buildInstagramCaptionPrompt(topic: string, tone = "engaging") {
  return `You are a viral Instagram content strategist with 10+ years of experience.

Write 3 short, scroll-stopping Instagram captions.

Topic: ${topic}
Tone: ${tone}

Rules:
- Each caption should be under 150 characters
- Use catchy hooks in the first line
- Simple, relatable English
- Use relevant emojis naturally
- Include a call-to-action
- Output as numbered list`;
}

export function buildInstagramHashtagPrompt(topic: string, niche = "general") {
  return `You are a social media growth expert.

Generate 20 strategic Instagram hashtags for this content:

Topic: ${topic}
Niche: ${niche}

Rules:
- Mix of popular (1M+), medium (100K-1M), and niche (<100K) hashtags
- Relevant to the topic
- No banned/spammy hashtags
- Output as space-separated list starting with #`;
}

// ─── Ultra Advanced Hashtag Generator ──────────────────────

export function buildAdvancedHashtagPrompt(
  topic: string,
  audience = "general",
  contentType = "post"
) {
  return `You are a world-class social media growth expert specializing in viral hashtag strategy across Instagram, YouTube, and Twitter (X).

Generate a LARGE, HIGH-QUALITY, NON-REPETITIVE set of hashtags optimized for reach, engagement, and discoverability.

Topic: "${topic}"
Audience: ${audience}
Content Type: ${contentType}

Return ONLY valid JSON in this EXACT format (no markdown, no explanation, just pure JSON):

{
  "instagram": {
    "viral_high_competition": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12", "#tag13", "#tag14", "#tag15"],
    "medium_competition": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12"],
    "low_competition_niche": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"],
    "long_tail": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"]
  },
  "youtube": {
    "seo_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
    "video_tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
    "long_tail_keywords": ["long tail 1", "long tail 2", "long tail 3", "long tail 4", "long tail 5", "long tail 6"],
    "shorts_tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"]
  },
  "twitter": {
    "trending": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "viral": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "conversation": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "niche": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  },
  "top_viral_overall": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"],
  "scores": {
    "#tag1": 95,
    "#tag2": 88
  }
}

REQUIREMENTS:
- Instagram: 40-50 total hashtags across all categories
- YouTube: 20-30 tags/keywords
- Twitter: 15-20 hashtags
- NO repetition across ANY category
- NO generic spam (#like4like, #followforfollow, #follow)
- Every hashtag must be specifically relevant to "${topic}"
- Include modern trends (AI, creator economy, growth if relevant)
- top_viral_overall = 10 most powerful hashtags from the entire set
- scores = performance score (1-100) for EACH tag in top_viral_overall based on expected reach vs competition
- Make hashtags look natural and human-curated
- Return ONLY the JSON object, nothing else`;
}

// ─── YouTube ───────────────────────────────────────────────

export function buildYouTubeTitlePrompt(topic: string) {
  return `You are a YouTube SEO expert who has helped channels grow to 1M+ subscribers.

Generate 5 viral YouTube video titles for this topic:
${topic}

Rules:
- High click-through rate (CTR) optimized
- Under 60 characters each
- Use curiosity gaps, numbers, or power words
- No clickbait — must deliver on promise
- Output as numbered list`;
}

export function buildYouTubeDescriptionPrompt(
  topic: string,
  title: string
) {
  return `You are a YouTube SEO specialist.

Write an optimized YouTube video description.

Video Topic: ${topic}
Video Title: ${title}

Structure:
1. Hook (first 2 lines — visible before "Show More")
2. Video summary (3-4 sentences)
3. Timestamps placeholder
4. Relevant links placeholder
5. 10 SEO-optimized tags as comma-separated list

Rules:
- Natural keyword placement
- Include a subscribe CTA
- Professional but conversational tone`;
}

// ─── Twitter/X ─────────────────────────────────────────────

export function buildTwitterPostPrompt(topic: string, style = "informative") {
  return `You are a viral Twitter/X content creator.

Write 3 tweet variations for this topic:

Topic: ${topic}
Style: ${style}

Rules:
- Each tweet under 280 characters
- Hook in first line
- Use line breaks for readability
- Include relevant emojis sparingly
- One should be a hot take, one informative, one conversational
- Output as numbered list`;
}

// ─── Trends ────────────────────────────────────────────────

export function buildTrendAnalysisPrompt(niche: string) {
  return `You are a social media trend analyst.

Analyze current trending topics and content patterns for this niche:

Niche: ${niche}

Provide:
1. Top 5 trending content themes right now
2. 3 emerging trends to watch
3. Content format recommendations (Reels, Shorts, Threads, etc.)
4. Best posting times suggestion
5. Predicted viral topic for next week

Format each section with a clear heading and bullet points.`;
}

// ─── Content Plan ──────────────────────────────────────────

export function buildContentPlanPrompt(
  niche: string,
  platforms: string[],
  days = 7
) {
  return `You are a content strategist for social media creators.

Create a ${days}-day content calendar.

Niche: ${niche}
Platforms: ${platforms.join(", ")}

For each day provide:
- Platform
- Content type (Reel, Post, Story, Tweet, Short, etc.)
- Topic/idea
- Best posting time
- Caption hook (first line)

Format as a structured daily plan. Make it actionable and specific.`;
}

// ─── Virality Score ────────────────────────────────────────

export function buildViralityPrompt(topic: string, platform = "Instagram") {
  return `You are an expert content virality analyst who has studied 1M+ viral posts.

Analyze this content idea for virality potential on ${platform}.

Topic: ${topic}

Score each metric from 0-100 and provide a brief explanation for each:

1. **Overall Virality Score**: /100
2. **Hook Score**: How attention-grabbing is the first line? /100
3. **Emotional Score**: Does it trigger emotions (curiosity, joy, shock)? /100
4. **Retention Score**: Will people watch/read till the end? /100
5. **Shareability Score**: Will people share this with others? /100
6. **Trend Alignment**: Does it align with current trends? /100

Also provide:
- Top 3 suggestions to increase virality
- Best content format for this topic (Reel, Post, Story, Thread, Short)
- Predicted engagement level (Low / Medium / High / Viral potential)

Format the output clearly with each score on its own line.`;
}

