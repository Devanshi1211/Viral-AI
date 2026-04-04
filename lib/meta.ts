// Meta (Instagram + Facebook) OAuth helpers
import { env } from "@/lib/env";

const GRAPH_API_VERSION = "v25.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Build Meta OAuth login URL
 * Scopes: instagram_basic, pages_show_list, business_management
 */
export function getMetaLoginUrl(): string {
  const params = new URLSearchParams({
    client_id: env.META_APP_ID,
    redirect_uri: env.META_REDIRECT_URI,
    response_type: "code",
    scope: [
      "instagram_basic",
      "instagram_manage_insights",
      "pages_show_list",
      "pages_read_engagement",
      "business_management",
    ].join(","),
  });

  return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?${params.toString()}`;
}

/**
 * Exchange auth code for access token
 */
export async function exchangeMetaCode(code: string) {
  const tokenUrl = new URL(`${GRAPH_BASE}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", env.META_APP_ID);
  tokenUrl.searchParams.set("client_secret", env.META_APP_SECRET);
  tokenUrl.searchParams.set("redirect_uri", env.META_REDIRECT_URI);
  tokenUrl.searchParams.set("code", code);

  const res = await fetch(tokenUrl.toString());
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || "Meta token exchange failed");
  }

  return data; // { access_token, token_type, expires_in }
}

/**
 * Get long-lived token (60 days instead of ~1 hour)
 */
export async function getLongLivedToken(shortToken: string) {
  const url = new URL(`${GRAPH_BASE}/oauth/access_token`);
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", env.META_APP_ID);
  url.searchParams.set("client_secret", env.META_APP_SECRET);
  url.searchParams.set("fb_exchange_token", shortToken);

  const res = await fetch(url.toString());
  return res.json();
}

/**
 * Get user's Facebook Pages (needed for Instagram Business access)
 */
export async function getUserPages(accessToken: string) {
  const url = new URL(`${GRAPH_BASE}/me/accounts`);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("fields", "id,name,access_token,instagram_business_account");

  const res = await fetch(url.toString());
  return res.json();
}

/**
 * Get Instagram Business Account linked to a Facebook Page
 */
export async function getInstagramAccount(pageId: string, accessToken: string) {
  const url = new URL(`${GRAPH_BASE}/${pageId}`);
  url.searchParams.set("fields", "instagram_business_account{id,name,username,profile_picture_url,followers_count,media_count}");
  url.searchParams.set("access_token", accessToken);

  const res = await fetch(url.toString());
  return res.json();
}

/**
 * Get Facebook Page details
 */
export async function getPageDetails(pageId: string, accessToken: string) {
  const url = new URL(`${GRAPH_BASE}/${pageId}`);
  url.searchParams.set("fields", "id,name,fan_count,followers_count,category,picture");
  url.searchParams.set("access_token", accessToken);

  const res = await fetch(url.toString());
  return res.json();
}

/**
 * Get Instagram media/posts
 */
export async function getInstagramMedia(igAccountId: string, accessToken: string) {
  const url = new URL(`${GRAPH_BASE}/${igAccountId}/media`);
  url.searchParams.set("fields", "id,caption,media_type,media_url,timestamp,like_count,comments_count,permalink");
  url.searchParams.set("limit", "12");
  url.searchParams.set("access_token", accessToken);

  const res = await fetch(url.toString());
  return res.json();
}

/**
 * Get Instagram insights
 */
export async function getInstagramInsights(igAccountId: string, accessToken: string) {
  const url = new URL(`${GRAPH_BASE}/${igAccountId}/insights`);
  url.searchParams.set("metric", "impressions,reach,profile_views");
  url.searchParams.set("period", "day");
  url.searchParams.set("access_token", accessToken);

  const res = await fetch(url.toString());
  return res.json();
}
