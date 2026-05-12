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

// Try llama 3.1 8b
axios.post(
  'https://integrate.api.nvidia.com/v1/chat/completions',
  {
    model: 'meta/llama-3.1-8b-instruct',
    messages: [
      { role: 'user', content: 'Hello' },
    ],
    max_tokens: 10,
  },
  {
    headers: { Authorization: `Bearer ${key}` },
    timeout: 10000,
  }
)
  .then((res) => {
    console.log('Success with llama-3.1-8b');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Failed with llama-3.1-8b:', err.response ? err.response.status : err.message);
    process.exit(1);
  });
