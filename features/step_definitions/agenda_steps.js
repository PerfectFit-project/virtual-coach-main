const { Before, Given, When, Then } = require('cucumber')
require('isomorphic-fetch');
const assert = require('assert');
const { Chat, SenseServerEnvironment, ConnectionStatus, Authentication, SenseServer } = require('@sense-os/goalie-js')

const RASA_URL = 'http://localhost:5005';
const NICEDAY_API_URL = 'http://localhost:8080';
const EXPECTED_PLANNING_OFFERS = ['Zal ik de planning in je NiceDay agenda zetten?',
                                  'Wil je dat ik de planning in je NiceDay agenda zet?'];
const EXPECTED_RUNNING_DISTANCE_RESPONSE = 'you should run';
const EXPECTED_CONFIRMATION_RESPONSE = ['Okay, de planning staat nu in je NiceDay agenda.','Cool, ik heb de planning in je NiceDay agenda ingevoerd.'];
const EXPECTED_MOOD_QUESTION = 'Hoe gaat het met je?';
const EXPECTED_GREETINGS = 'Hallo ';
const EXPECTED_POSITIVE_MOOD_RESPONSE = 'Ik ben blij dat te horen!';
const EXPECTED_NEGATIVE_MOOD_RESPONSE = 'Aww, het spijt me. Ik hoop dat je je snel beter voelt.';
const EXPECTED_CIGARETTES_RESPONSE = 'Je hebt vandaag ';
const ASK_AGENDA = 'Kan ik de agenda voor de week krijgen?';
const YES_RESPONSE = 'Ja';
const USER_GREETINGS = 'Hi';
const POSITIVE_MOOD = 'Ik voel me ook goed.';
const NEGATIVE_MOOD = 'Ik voel me niet zo goed.';
const REQUEST_CIGARETTES_NUMBER = 'Hoeveel sigaretten heb ik vandaag gerookt?';
const THERAPIST_ID = '38714';
const USERNAME = 'walter.baccinelli@gmail.com';
const USER_PSW = 'Thisisatest1!';
const USER_NAME = 'User';

var {setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(20000); //increase the timeout

let context = {};

var connectionFlag = false;

const authSdk = new Authentication(SenseServer.Alpha);
const chatSdk = new Chat();
chatSdk.init(SenseServerEnvironment.Alpha);

function sendPatientMsg(txt, callback){
   chatSdk.sendTextMessage(THERAPIST_ID, txt)
  .then(response => {
    context.patient_message_response = response;
    callback();
  })
  .catch((error) => {
    callback(error);
  });
}

function verifyRasaResponse(expected_response, callback){
  assert(context.hasOwnProperty("therapist_response"));
  assert(context.therapist_response.hasOwnProperty("content"));
  assert(context.therapist_response['content'].hasOwnProperty("TEXT"));
  if (context.therapist_response['content']['TEXT'].includes(expected_response)) {
    callback();
  }
  callback('Error');
}

function verifyRasaResponseMultiple(expected_response, callback){
  assert(context.hasOwnProperty("therapist_response"));
  assert(context.therapist_response.hasOwnProperty("content"));
  assert(context.therapist_response['content'].hasOwnProperty("TEXT"));
  assert(expected_response.includes(context.therapist_response['content']['TEXT']));
  callback();
}

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
  sendPatientMsg(ASK_AGENDA, callback);
});

Then('the message is addressed to the therapist', function (callback) {
  assert(context.hasOwnProperty("patient_message_response"));
  assert(context.patient_message_response.hasOwnProperty('to'));
  assert(context.patient_message_response['to'] == THERAPIST_ID);
  callback();
});

Then('rasa bot offers to add planning to niceday agenda', function (callback) {
  verifyRasaResponseMultiple(EXPECTED_PLANNING_OFFERS, callback)
});

When('we respond yes', function (callback) {
  sendPatientMsg(YES_RESPONSE, callback);
});

Then('rasa bot confirms it has added planning to niceday agenda', function (callback) {
  verifyRasaResponseMultiple(EXPECTED_CONFIRMATION_RESPONSE, callback);
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
  verifyRasaResponse(EXPECTED_RUNNING_DISTANCE_RESPONSE, callback);
});

When('users says hi', function (callback) {
  sendPatientMsg(USER_GREETINGS, callback);
});

Then('therapist responds by greeting the user using the correct name', function (callback) {
  verifyRasaResponse(USER_NAME, callback);
});

Then('therapist asks for the user mood', function (callback) {
  verifyRasaResponse(EXPECTED_MOOD_QUESTION, callback);
});

When('users responds with positive mood', function (callback) {
  sendPatientMsg(POSITIVE_MOOD, callback);
});

When('users responds with negative mood', function (callback) {
   sendPatientMsg(NEGATIVE_MOOD, callback);
});

Then('therapist congratulates', function (callback) {
  verifyRasaResponse(EXPECTED_POSITIVE_MOOD_RESPONSE, callback);
});

Then('therapist is sorry', function (callback) {
  verifyRasaResponse(EXPECTED_NEGATIVE_MOOD_RESPONSE, callback);
});

When('users asks for consumed cigarettes', function (callback) {
  sendPatientMsg(REQUEST_CIGARETTES_NUMBER, callback);
});

Then('therapist responds with the number of tracked cigarettes', function (callback) {
  var cigarettes_number = 0;
  // build the dates
  var today = new Date();
  var startTime = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0") + 'T00%3A00%3A00Z';
  var endTime = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0") + 'T23%3A59%3A59Z';

  // request to the niceday api to verify the repsonse
  const baseurl = NICEDAY_API_URL + '/usertrackers/smoking/'+ context.user_id + '?startTime=' + startTime + '&endTime=' + endTime;
  fetch(baseurl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    for (const content of data) {
        cigarettes_number += content["value"]["quantity"];
    }
    verifyRasaResponse(EXPECTED_CIGARETTES_RESPONSE + cigarettes_number, callback);
    callback();
  })
  .catch((error) => {
    callback(error);
  });
});