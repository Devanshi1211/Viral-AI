const fs = require('fs');
const axios = require('axios');
const envText = fs.readFileSync('.env', 'utf8');
const lines = envText.split(/\r?\n/);
const env = {};
for (const line of lines) {
  if (!line.trim() || line.trim().startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  const key = line.slice(0, idx).trim();
  const value = line.slice(idx + 1).trim();
  env[key] = value;
}
const key = env.NVIDIA_API_KEY;
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const prompt = `You are a world-class social media content strategist.\n\nGenerate content for this topic: "coffee"\nTone: professional\nPlatform: general\n\nReturn EXACTLY in this format with clear sections:\n\nHOOKS:\n1. [hook 1]\n2. [hook 2]\n3. [hook 3]\n4. [hook 4]\n5. [hook 5]\n\nHEADLINES:\n1. [headline 1]\n2. [headline 2]\n3. [headline 3]\n4. [headline 4]\n5. [headline 5]\n\nCTAS:\n1. [cta 1]\n2. [cta 2]\n3. [cta 3]\n4. [cta 4]\n5. [cta 5]\n\nCAPTIONS:\nCAPTION 1:\n[full caption with hook, value, CTA, and relevant hashtags]\n\nCAPTION 2:\n[full caption with hook, value, CTA, and relevant hashtags]\n\nCAPTION 3:\n[full caption with hook, value, CTA, and relevant hashtags]\n\nRules:\n- Hooks: attention-grabbing first lines, under 15 words each\n- Headlines: compelling titles with emojis, numbers, or power words\n- CTAs: engagement-driving calls-to-action\n- Captions: full ready-to-post captions with hashtags`;

axios.post(NVIDIA_URL, {
  model: 'moonshotai/kimi-k2.5',
  messages: [
    { role: 'system', content: 'You are a viral content strategist and social media expert. Always respond with clean, well-formatted text. No markdown headers unless asked.' },
    { role: 'user', content: prompt },
  ],
  max_tokens: 4096,
  temperature: 0.7,
  top_p: 1.0,
  stream: false,
}, {
  headers: {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 120000,
})
.then(res => {
  console.log('status', res.status);
  console.log(JSON.stringify(res.data, null, 2).slice(0, 2000));
})
.catch(err => {
  if (err.response) {
    console.error('response status', err.response.status);
    console.error(JSON.stringify(err.response.data, null, 2).slice(0, 2000));
  } else {
    console.error('error', err.message);
  }
});
