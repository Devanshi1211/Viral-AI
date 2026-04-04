// Token storage — in-memory for development
// In production, use encrypted DB or secure server sessions

interface StoredTokens {
  meta?: {
    accessToken: string;
    expiresAt?: number;
    pageTokens?: Record<string, string>; // pageId -> pageAccessToken
    igAccountId?: string;
  };
  x?: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    userId?: string;
    codeVerifier?: string; // For PKCE flow
  };
}

// In-memory store (resets on server restart)
// TODO: Replace with database in production
const tokenStore: StoredTokens = {};

// ─── Meta Tokens ───────────────────────────────────────────

export function setMetaToken(accessToken: string, expiresIn?: number) {
  tokenStore.meta = {
    accessToken,
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
  };
}

export function getMetaToken(): string | null {
  if (!tokenStore.meta) return null;
  if (tokenStore.meta.expiresAt && Date.now() > tokenStore.meta.expiresAt) {
    tokenStore.meta = undefined;
    return null;
  }
  return tokenStore.meta.accessToken;
}

export function setMetaPageTokens(
  pageTokens: Record<string, string>,
  igAccountId?: string
) {
  if (tokenStore.meta) {
    tokenStore.meta.pageTokens = pageTokens;
    if (igAccountId) tokenStore.meta.igAccountId = igAccountId;
  }
}

export function getMetaPageToken(pageId: string): string | null {
  return tokenStore.meta?.pageTokens?.[pageId] || null;
}

export function getIgAccountId(): string | null {
  return tokenStore.meta?.igAccountId || null;
}

// ─── X Tokens ──────────────────────────────────────────────

export function setXCodeVerifier(verifier: string) {
  if (!tokenStore.x) {
    tokenStore.x = { accessToken: "", codeVerifier: verifier };
  } else {
    tokenStore.x.codeVerifier = verifier;
  }
}

export function getXCodeVerifier(): string | null {
  return tokenStore.x?.codeVerifier || null;
}

export function setXToken(
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
  userId?: string
) {
  tokenStore.x = {
    accessToken,
    refreshToken,
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
    userId,
  };
}

export function getXToken(): string | null {
  if (!tokenStore.x) return null;
  if (tokenStore.x.expiresAt && Date.now() > tokenStore.x.expiresAt) {
    return null; // Expired — needs refresh
  }
  return tokenStore.x.accessToken;
}

export function getXRefreshToken(): string | null {
  return tokenStore.x?.refreshToken || null;
}

export function getXUserId(): string | null {
  return tokenStore.x?.userId || null;
}

// ─── Connection Status ─────────────────────────────────────

export function getConnectionStatus() {
  return {
    meta: !!getMetaToken(),
    x: !!getXToken(),
  };
}

export function disconnectMeta() {
  tokenStore.meta = undefined;
}

export function disconnectX() {
  tokenStore.x = undefined;
}
