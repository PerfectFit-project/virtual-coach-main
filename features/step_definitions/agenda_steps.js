const { Before, Given, When, Then } = require('cucumber')
require('isomorphic-fetch');
const assert = require('assert');

const RASA_URL = 'http://localhost:5005';
const EXPECTED_PLANNING_OFFERS = ['Zal ik de planning in je NiceDay agenda zetten?',
                                  'Wil je dat ik de planning in je NiceDay agenda zet?'];
const EXPECTED_RUNNING_DISTANCE_RESPONSE = 'you should run';

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
  assert(context.hasOwnProperty("chat_responses"));
  assert(context.chat_responses.length > 0);
  assert(context.chat_responses.at(-1).hasOwnProperty("text"));
  assert(EXPECTED_PLANNING_OFFERS.includes(context.chat_responses.at(-1)['text']));
  callback();
});

When('we respond yes', function (callback) {
  const webhookurl = RASA_URL + '/webhooks/rest/webhook';
  const body = {
      "message": "Ja",
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

Then('rasa bot confirms it has added planning to niceday agenda', function (callback) {
  assert(context.hasOwnProperty("chat_responses"));
  for (const msg of context.chat_responses) {
    assert(msg.hasOwnProperty("text"));
    if (msg['text'].includes('Cool') || msg['text'].includes('Okay')) {
      callback();
    }
  }
  callback('No confirmation.');

});

Then('all messages are found to be addressed to the user', function (callback) {
  assert(context.hasOwnProperty("chat_responses"));
  for (const msg of context.chat_responses) {
    assert(msg.hasOwnProperty('recipient_id'));
    assert(msg['recipient_id'] === '38527');
  }
  callback();
});

Then('advice on running distance is given', function (callback) {
  assert(context.hasOwnProperty("chat_responses"));
  assert(context.chat_responses.length > 0);
  for (const msg of context.chat_responses) {
    assert(msg.hasOwnProperty("text"));
    if (msg['text'].includes(EXPECTED_RUNNING_DISTANCE_RESPONSE)) {
      callback();
    }
  }
  callback('No advice on running given.');
});
