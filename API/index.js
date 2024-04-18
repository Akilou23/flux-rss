const express = require('express');
const axios = require('axios');
const rss = require('rss');

const app = express();

app.use(express.json());

app.post('/message', (req, res) => {
  const message = req.body.message;

  const feed = new rss({
    title: 'Votre flux RSS',
    description: 'Flux RSS généré à partir des messages envoyés par les utilisateurs',
    site_url: 'https://akilou23.github.io/flux-rss/',
    feed_url: 'https://flux-rl0a49okg-akilou23s-projects.vercel.app/flux-rss',
    language: 'fr',
    ttl: '60',
  });

  feed.item({
    title: message,
    description: message,
    url: 'https://akilou23.github.io/flux-rss/',
    date: new Date(),
  });

  res.set('Content-Type', 'application/rss+xml');
  res.send(feed.xml());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
