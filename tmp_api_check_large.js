const axios = require('axios');
const prompt = `You are a world-class social media content strategist.\n\nGenerate content for this topic: "coffee"\nTone: professional\nPlatform: general\n\nReturn EXACTLY in this format with clear sections:\n\nHOOKS:\n1. [hook 1]\n2. [hook 2]\n3. [hook 3]\n4. [hook 4]\n5. [hook 5]\n\nHEADLINES:\n1. [headline 1]\n2. [headline 2]\n3. [headline 3]\n4. [headline 4]\n5. [headline 5]\n\nCTAS:\n1. [cta 1]\n2. [cta 2]\n3. [cta 3]\n4. [cta 4]\n5. [cta 5]\n\nCAPTIONS:\nCAPTION 1:\n[full caption with hook, value, CTA, and relevant hashtags]\n\nCAPTION 2:\n[full caption with hook, value, CTA, and relevant hashtags]\n\nCAPTION 3:\n[full caption with hook, value, CTA, and relevant hashtags]\n\nRules:\n- Hooks: attention-grabbing first lines, under 15 words each\n- Headlines: compelling titles with emojis, numbers, or power words\n- CTAs: engagement-driving calls-to-action\n- Captions: full ready-to-post captions with hashtags`;

axios
  .post('http://localhost:3000/api/gemini', { prompt }, { headers: { 'Content-Type': 'application/json' }, timeout: 120000 })
  .then((res) => {
    console.log('status', res.status);
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch((err) => {
    if (err.response) {
      console.error('response status', err.response.status);
      console.error('response data', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('error', err.message);
    }
  });
