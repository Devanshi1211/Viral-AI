// Twitter/X OAuth 2.0 helpers
import { env } from "@/lib/env";

const X_AUTH_URL = "https://twitter.com/i/oauth2/authorize";
const X_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const X_API_BASE = "https://api.twitter.com/2";

/**
 * Build X OAuth 2.0 login URL (PKCE flow)
 */
export function getXLoginUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.X_CLIENT_ID,
    redirect_uri: env.X_REDIRECT_URI,
    scope: "tweet.read users.read tweet.write offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "plain", // Use "S256" in production
  });

  return `${X_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange auth code for access token
 */
export async function exchangeXCode(code: string, codeVerifier: string) {
  const basicAuth = Buffer.from(
    `${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(X_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: env.X_REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error_description || "X token exchange failed");
  }

  return data; // { access_token, token_type, expires_in, scope, refresh_token }
}

/**
 * Refresh X access token
 */
export async function refreshXToken(refreshToken: string) {
  const basicAuth = Buffer.from(
    `${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(X_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return res.json();
}

/**
 * Get authenticated user info
 */
export async function getXUserInfo(accessToken: string) {
  const res = await fetch(`${X_API_BASE}/users/me?user.fields=id,name,username,profile_image_url,public_metrics,description`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.json();
}

/**
 * Get user's recent tweets
 */
export async function getXUserTweets(userId: string, accessToken: string) {
  const params = new URLSearchParams({
    "tweet.fields": "created_at,public_metrics,text",
    max_results: "10",
  });

  const res = await fetch(`${X_API_BASE}/users/${userId}/tweets?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.json();
}

/**
 * Post a tweet
 */
export async function postTweet(text: string, accessToken: string) {
  const res = await fetch(`${X_API_BASE}/tweets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  return res.json();
}
