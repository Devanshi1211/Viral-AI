// Frontend API caller — unified client for all backend endpoints

export async function callAI(
  endpoint: string,
  payload: Record<string, unknown>
) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "API request failed");
  }

  return data;
}

export async function fetchAPI(endpoint: string) {
  const res = await fetch(endpoint);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "API request failed");
  return data;
}

// ─── Content Generation ────────────────────────────────────

export async function generateCaption(topic: string, tone = "engaging") {
  return callAI("/api/instagram/captions", { topic, tone });
}

export async function generateHashtags(topic: string, niche = "general") {
  return callAI("/api/instagram/hashtags", { topic, niche });
}

export async function generateYouTubeTitles(topic: string) {
  return callAI("/api/youtube/titles", { topic });
}

export async function generateYouTubeDescription(topic: string, title: string) {
  return callAI("/api/youtube/descriptions", { topic, title });
}

export async function generateTweet(topic: string, style = "informative") {
  return callAI("/api/twitter/posts", { topic, style });
}

// ─── AI Analysis ───────────────────────────────────────────

export async function analyzeTrends(niche: string) {
  return callAI("/api/trends", { niche });
}

export async function generateContentPlan(
  topic: string,
  platform = "Instagram",
  audience = "General",
  tone = "engaging"
) {
  return callAI("/api/content-plan", { topic, platform, audience, tone });
}

export async function analyzeVirality(topic: string, platform = "Instagram") {
  return callAI("/api/virality-score", { topic, platform });
}

// ─── ML Prediction ─────────────────────────────────────────

export async function predictVirality(input: {
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
  captionLength: number;
  hashtagsCount: number;
  postingHour: number;
  engagementRate: number;
}) {
  return callAI("/api/virality-score", input);
}

// ─── Data Fetchers (GET) ───────────────────────────────────

export async function fetchDashboard() {
  return fetchAPI("/api/dashboard");
}

export async function fetchTrends() {
  return fetchAPI("/api/trends");
}

export async function fetchInstagramAnalysis() {
  return fetchAPI("/api/instagram/analysis");
}

export async function fetchYouTubeAnalysis() {
  return fetchAPI("/api/youtube/analysis");
}

export async function fetchTwitterAnalysis() {
  return fetchAPI("/api/twitter/analysis");
}
