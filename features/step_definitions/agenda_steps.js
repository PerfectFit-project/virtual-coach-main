const { Before, Given, When, Then } = require('cucumber')
const http = require('http')
require('isomorphic-fetch');

const RASA_URL = 'http://localhost:5005';

Given('rasa bot is up and running', function (callback) {

  http.get(RASA_URL, (res) => {
    const { statusCode } = res;

    if (statusCode !== 200) {
      const error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
      callback(error);
    } else {
      callback();
    }
  });
});

When('we ask for the agenda', function (callback) {
  const webhookurl = RASA_URL + '/webhooks/rest/webhook';

  const body = {
      "message": "Kan ik de agenda voor de week krijgen?",
      "sender": "38527"};

  fetch(webhookurl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(response => response.json())
  .then(data => {
    callback();
  })
  .catch((error) => {
    callback(error);
  });

    // context.chat_responses = r.json()
});

