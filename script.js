//script qui est exécuté dans "index.html" et qui envoie le message saisait à l'API

const form = document.getElementById('my-form');
const messageInput = document.getElementById('message');
const messageSent = document.getElementById('message-sent');

form.addEventListener('submit', event => {
  event.preventDefault();
  const message = messageInput.value;
  messageInput.value = '';
  messageSent.style.display = 'block';

  // Envoyer le message à votre API en utilisant la méthode fetch()

  fetch('/flux-rss', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi du message');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
});
