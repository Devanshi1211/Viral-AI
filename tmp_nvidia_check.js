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
console.log('NVIDIA_API_KEY present:', !!key);
console.log('Key preview:', key ? key.slice(0, 10) + '...' : 'none');
axios.post(
  'https://integrate.api.nvidia.com/v1/chat/completions',
  {
    model: 'moonshotai/kimi-k2.5',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Say hello in one sentence.' },
    ],
    max_tokens: 20,
    temperature: 0.5,
    top_p: 1.0,
    stream: false,
  },
  {
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 20000,
  }
)
  .then((res) => {
    console.log('status', res.status);
    console.log('data', JSON.stringify(res.data, null, 2).slice(0, 1000));
  })
  .catch((err) => {
    if (err.response) {
      console.error('response status', err.response.status);
      console.error('response data', JSON.stringify(err.response.data, null, 2).slice(0, 2000));
    } else {
      console.error('error', err.message);
    }
  });
