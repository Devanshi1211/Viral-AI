const axios = require('axios');
axios.post('http://localhost:3000/api/gemini', {
  prompt: 'Write a short social media caption for coffee.',
}, {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
})
.then((res) => {
  console.log('status', res.status);
  console.log('data', JSON.stringify(res.data, null, 2));
})
.catch((err) => {
  if (err.response) {
    console.error('response status', err.response.status);
    console.error('response data', JSON.stringify(err.response.data, null, 2));
  } else {
    console.error('error', err.message);
  }
});
