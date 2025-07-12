import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/image', async (req, res) => {
  const src = req.query.src;
  if (!src) {
    return res.status(400).send('Missing src param');
  }
  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error('Failed to fetch image');
    res.set('Content-Type', response.headers.get('content-type'));
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Error fetching image');
  }
});

app.listen(3001, () => console.log('Proxy server running on http://localhost:3001'));
