const { Before, Given, When, Then } = require('cucumber')
require('isomorphic-fetch');
const assert = require('assert');
const { Chat, SenseServerEnvironment, ConnectionStatus, Authentication, SenseServer } = require('@sense-os/goalie-js')

const RASA_URL = 'http://localhost:5005';
const EXPECTED_PLANNING_OFFERS = ['Zal ik de planning in je NiceDay agenda zetten?',
                                  'Wil je dat ik de planning in je NiceDay agenda zet?'];
const EXPECTED_RUNNING_DISTANCE_RESPONSE = 'you should run';
const EXPECTED_CONFIRMATION_RESPONSE = ['Okay, de planning staat nu in je NiceDay agenda.','Cool, ik heb de planning in je NiceDay agenda ingevoerd.'];
const YES_RESPONSE = 'Ja';
const THERAPIST_ID = '38714';
const USERNAME = 'walter.baccinelli@gmail.com';
const USER_PSW = 'Thisisatest1!';

var {setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(20000); //increase the timeout

let context = {};

var connectionFlag = false;

const authSdk = new Authentication(SenseServer.Alpha);
const chatSdk = new Chat();
chatSdk.init(SenseServerEnvironment.Alpha);

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

When('user is authenticated',  async() => {
 var userData = await authSdk.login(USERNAME, USER_PSW);
 context.user_id = userData.user.id;
 context.token = userData.token;
});

Then('test user is connected',  function() {
return new Promise((resolve, reject) => {
    const chatSdk = new Chat();
    chatSdk.init(SenseServerEnvironment.Alpha);
    chatSdk.connect(context.user_id, context.token);

    const subscriptionId = chatSdk.subscribeToConnectionStatusChanges((connectionStatus) => {
      if (connectionStatus === ConnectionStatus.Connected) {
        chatSdk.sendInitialPresence();
          chatSdk.unsubscribeFromConnectionStatusChanges(subscriptionId);
          resolve();
      }
    });
  });
});

When('we ask for the agenda', function (callback) {
   chatSdk.sendTextMessage(THERAPIST_ID, "Kan ik de agenda voor de week krijgen?")
  .then(response => {
    context.patient_message_response = response;
    callback();
  })
  .catch((error) => {
    callback(error);
  })
});

Then('the message is addressed to the therapist', function (callback) {
  assert(context.hasOwnProperty("patient_message_response"));
  assert(context.patient_message_response.hasOwnProperty('to'));
  assert(context.patient_message_response['to'] == THERAPIST_ID);
  callback();
});

Then('rasa bot offers to add planning to niceday agenda', function (callback) {
  assert(context.hasOwnProperty("therapist_response"));
  assert(context.therapist_response.hasOwnProperty("content"));
  assert(context.therapist_response['content'].hasOwnProperty("TEXT"));
  assert(EXPECTED_PLANNING_OFFERS.includes(context.therapist_response['content']['TEXT']));
  callback();
  });

When('we respond yes', function (callback) {
   chatSdk.sendTextMessage(THERAPIST_ID, YES_RESPONSE)
  .then(response => {
    context.patient_message_response = response;
    callback();
  })
  .catch((error) => {
    callback(error);
  })
});

Then('rasa bot confirms it has added planning to niceday agenda', function (callback) {
  assert(context.hasOwnProperty("therapist_response"));
  assert(context.therapist_response.hasOwnProperty("content"));
  assert(context.therapist_response['content'].hasOwnProperty("TEXT"));
  assert(EXPECTED_CONFIRMATION_RESPONSE.includes(context.therapist_response['content']['TEXT']));
  callback();
});

When('therapist produces a response', function() {
  return new Promise((resolve, reject) => {
    const msgID = chatSdk.subscribeToIncomingMessage((response) => {
      context.therapist_response = response;
      chatSdk.unsubscribeFromIncomingMessage(msgID);
      resolve();
    });
  });
});

Then('therapist response is found to be addressed to the user', function(callback) {
  assert(context.hasOwnProperty("therapist_response"));
  assert(context.therapist_response.hasOwnProperty('to'));
  assert(context.therapist_response['to'] == context.user_id);
  callback();
});

Then('advice on running distance is given', function (callback) {
  assert(context.hasOwnProperty("therapist_response"));
  assert(context.therapist_response.hasOwnProperty("content"));
  assert(context.therapist_response['content'].hasOwnProperty("TEXT"));
  if (context.therapist_response['content']['TEXT'].includes(EXPECTED_RUNNING_DISTANCE_RESPONSE)) {
    callback();
  }
  callback('No advice on running given.');
});