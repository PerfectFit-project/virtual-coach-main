const { Before, Given, When, Then } = require('cucumber')
require('isomorphic-fetch');
const assert = require('assert');

const RASA_URL = 'http://localhost:5005';
const EXPECTED_PLANNING_OFFERS = ['Zal ik de planning in je NiceDay agenda zetten?',
                                  'Wil je dat ik de planning in je NiceDay agenda zet?'];

let context = {};

Given('rasa bot is up and running', function (callback) {

  fetch(RASA_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => {
    callback();
  })
  .catch((error) => {
    callback(error);
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
    context.chat_responses = data
    callback();
  })
  .catch((error) => {
    callback(error);
  });

});

Then('rasa bot offers to add planning to niceday agenda', function (callback) {
  console.log(context);

  assert(context.hasOwnProperty("chat_responses"));
  assert(context.chat_responses.length > 0);
  assert(context.chat_responses.at(-1).hasOwnProperty("text"));
  assert(EXPECTED_PLANNING_OFFERS.includes(context.chat_responses.at(-1)['text']));
  callback();
});

