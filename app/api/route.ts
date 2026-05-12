import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API root is available. Use one of the defined child endpoints.',
    endpoints: {
      gemini: '/api/gemini',
      instagramCaptions: '/api/instagram/captions',
      instagramHashtags: '/api/instagram/hashtags',
      instagramMediaAnalyze: '/api/instagram/media-analyze',
      instagramAnalysis: '/api/instagram/analysis',
      instagramAccount: '/api/instagram/account',
      youtubeTitles: '/api/youtube/titles',
      youtubeDescriptions: '/api/youtube/descriptions',
      youtubeThumbnailAnalyze: '/api/youtube/thumbnail-analyze',
      youtubeAnalysis: '/api/youtube/analysis',
      youtubeViralHashtags: '/api/youtube/viral-hashtags',
      twitterPosts: '/api/twitter/posts',
      twitterViralHashtags: '/api/twitter/viral-hashtags',
      twitterAnalysis: '/api/twitter/analysis',
      twitterAccount: '/api/twitter/account',
      trends: '/api/trends',
      contentPlan: '/api/content-plan',
      viralityScore: '/api/virality-score',
      dashboard: '/api/dashboard',
      authStatus: '/api/auth/status',
      authMetaLogin: '/api/auth/meta/login',
      authXLogin: '/api/auth/x/login',
    },
  });
}
