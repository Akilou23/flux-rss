// Importer les dépendances nécessaires.
const express = require('express');
const axios = require('axios');
const rss = require('rss');
const { KV } = require('@vercel/kv');

// Créer une nouvelle instance de la classe KV avec le nom de votre espace de noms KV
const kv = new KV(process.env.KV_URL);
console.log('Node.js version:', process.version);


// Créer une nouvelle instance d'Express
const app = express();

// Définir le middleware pour parser les requêtes JSON entrantes
app.use(express.json());

// Définir la route POST pour envoyer un message
app.post('https://flux-rl0a49okg-akilou23s-projects.vercel.app/', async (req, res) => {
  const message = req.body.message;

  // Stocker le message dans la base de données KV
  try {
    await kv.hset('messages', message);
    res.status(201).json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error);
    res.status(500).send('Erreur lors de l\'envoi du message');
  }
});

// Définir la route GET pour récupérer le flux RSS
app.get('/flux-rss', async (req, res) => {
  try {
    // Récupérer les messages stockés dans la base de données KV
    const messages = await kv.hgetall('messages');

    // Créer un nouvel objet RSS
    const feed = new rss({
      title: 'Votre flux RSS',
      description: 'Flux RSS généré à partir des messages envoyés par les utilisateurs',
      site_url: 'https://akilou23.github.io/flux-rss/',
      feed_url: 'https://flux-rl0a49okg-akilou23s-projects.vercel.app/flux-rss',
      language: 'fr',
      ttl: '60',
    });

    // Ajouter chaque message au flux RSS
    for (const message of messages) {
      feed.item({
        title: message,
        description: message,
        url: 'https://akilou23.github.io/flux-rss/',
        date: new Date(),
      });
    }

    // Définir le type de contenu de la réponse en tant que flux RSS
    res.set('Content-Type', 'application/rss+xml');

    // Envoyer le flux RSS en tant que réponse
    res.send(feed.xml());
  } catch (error) {
    console.error('Erreur lors de la génération du flux RSS :', error);
    res.status(500).send('Erreur lors de la génération du flux RSS');
  }
});

// Démarrer le serveur et écouter les requêtes entrantes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
