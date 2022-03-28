const { Before, Given, When, Then } = require('cucumber')
require('isomorphic-fetch');
const assert = require('assert');
const { Chat, SenseServerEnvironment, ConnectionStatus, Authentication, SenseServer } = require('@sense-os/goalie-js')
const { Client } = require('pg');
var fs = require('fs');
//const RASA_URL = 'http://localhost:5005';
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
const EXPECTED_EXERCISE_INTRODUCTION = ['Vandaag gaan wij een leuke oefening doen die je gaat helpen te stoppen met roken en genoeg te bewegen. ...',
                                  'We gaan nu aan de slag met een oefening om jou te helpen met stoppen met roken en genoeg laten bewegen. ...',
                                  'Om jou te helpen om genoeg te bewegen en te laten stoppen met roken, gaan we nu een oefening doen. ...'];
const EXPECTED_EXERCISE_NAME = 'wie wil ik straks zijn';
const EXPECTED_EXERCISE_DURATION = '15 minuten';
const EXPECTED_AT_ONCE = 'Het is belangrijk';
const EXPECTED_NOW_OR_LATER = 'Wil jij deze oefening nu doen of later?';
const EXPECTED_CONFIRM_LATER = ['OK, het is wel goed als je deze oefening snel doet. Dit gaat je helpen je doelen te behalen. ...',
                                  'Prima, dit is wel een belangrijke oefening die je snel moet doen. ...',
                                  'Goed, laten we deze oefening later doen. ...'];
const EXPECTED_WHEN_RESCHEDULE = 'Wanneer komt het beter uit? (1) Vanmiddag, om 17:00. (2) Vanavond, om 20:00. (3) Morgenochtend, om 8:00. Geef antwoord met 1, 2, of 3.';
const EXPECTED_CONFIRM_TIME = 'Prima, ik kom dan bij je terug';

const ASK_AGENDA = 'Kan ik de agenda voor de week krijgen?';
const YES_RESPONSE = 'Ja';
const USER_GREETINGS = 'Hi';
const POSITIVE_MOOD = 'Ik voel me ook goed.';
const NEGATIVE_MOOD = 'Ik voel me niet zo goed.';
const REQUEST_CIGARETTES_NUMBER = 'Hoeveel sigaretten heb ik vandaag gerookt?';
const START_SELF_DIALOG = 'Start future self dialog.';
const LATER = 'Later';
const NOW = 'nu';
const TIME_CHOICE = '1';
const SELECTED_SMOKING_WORDS = 'Fijn lekker eng';

const THERAPIST_ID = '38714';
const USERNAME = 'walter.baccinelli@gmail.com';
const USER_PSW = 'Thisisatest1!';
const USER_NAME = 'User';


var {setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(20000); //increase the timeout

let context = {};

//get the constant values stored in as json file step_variables.json
fs.readFile('./features/step_definitions/steps_variables.json', (err, data) => {
    if (err)
      console.log(err);
    else {
       context.constants = JSON.parse(data);
    }
})

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

  fetch(context.constants.RASA_URL, {
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

Given('the connection to the database is successful', function (callback) {

  const client = new Client({
  user: context.constants.DB_USER,
  host: context.constants.DB_HOST,
  database: context.constants.DB_NAME,
  password: context.constants.DB_PASSWORD,
  port: context.constants.DB_PORT,
 })
 client.connect()

 context.client=client;

 callback();
});

When('user is authenticated',  async() => {
 var userData = await authSdk.login(context.constants.USERNAME, context.constants.USER_PSW);
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

Then('the conversation is restarted', function (callback) {
 sendPatientMsg(context.constants.RESTART_COMMAND, callback);
});

When('we ask for the agenda', function (callback) {
  sendPatientMsg(context.constants.ASK_AGENDA, callback);
});

Then('the message is addressed to the therapist', function (callback) {
  assert(context.hasOwnProperty("patient_message_response"));
  assert(context.patient_message_response.hasOwnProperty('to'));
  assert(context.patient_message_response['to'] == context.constants.THERAPIST_ID);
  callback();
});

Then('rasa bot offers to add planning to niceday agenda', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_PLANNING_OFFERS, callback)
});

When('user responds yes', function (callback) {
  sendPatientMsg(context.constants.YES_RESPONSE, callback);
});

Then('rasa bot confirms it has added planning to niceday agenda', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_CONFIRMATION_RESPONSE, callback);
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
  verifyRasaResponse(context.constants.EXPECTED_RUNNING_DISTANCE_RESPONSE, callback);
});

When('users says hi', function (callback) {
  sendPatientMsg(context.constants.USER_GREETINGS, callback);
});

Then('therapist responds by greeting the user using the correct name', function (callback) {
  verifyRasaResponse(context.constants.USER_NAME, callback);
});

Then('therapist asks for the user mood', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_MOOD_QUESTION, callback);
});

When('users responds with positive mood', function (callback) {
  sendPatientMsg(context.constants.POSITIVE_MOOD, callback);
});

When('users responds with negative mood', function (callback) {
   sendPatientMsg(context.constants.NEGATIVE_MOOD, callback);
});

Then('therapist congratulates', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_POSITIVE_MOOD_RESPONSE, callback);
});

Then('therapist is sorry', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_NEGATIVE_MOOD_RESPONSE, callback);
});

When('users asks for consumed cigarettes', function (callback) {
  sendPatientMsg(context.constants.REQUEST_CIGARETTES_NUMBER, callback);
});

Then('therapist responds with the number of tracked cigarettes', function (callback) {
  var cigarettes_number = 0;
  // build the dates
  var today = new Date();
  var startTime = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0") + 'T00%3A00%3A00Z';
  var endTime = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0") + 'T23%3A59%3A59Z';

  // request to the niceday api to verify the repsonse
  const baseurl = context.constants.NICEDAY_API_URL + '/usertrackers/smoking/'+ context.user_id + '?startTime=' + startTime + '&endTime=' + endTime;
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
    verifyRasaResponse(context.constants.EXPECTED_CIGARETTES_RESPONSE + cigarettes_number, callback);
    callback();
  })
  .catch((error) => {
    callback(error);
  });
});

When('user starts future self dialog', function (callback) {
  sendPatientMsg(context.constants.START_SELF_DIALOG, callback);
});

Then('therapist introduces the exercise', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_EXERCISE_INTRODUCTION, callback);
});

Then('therapist says the exercise name', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_EXERCISE_NAME, callback);
});

Then('therapist says the exercise duration', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_EXERCISE_DURATION, callback);
});

Then('therapist says to do it at once', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_AT_ONCE, callback);
});

Then('therapist asks when to do the exercise', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_NOW_OR_LATER, callback);
});

When('user responds later', function (callback) {
  sendPatientMsg(context.constants.LATER, callback);
});

Then('therapist responds by confirming the later choice', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_CONFIRM_LATER, callback);
});

Then('therapist asks when to reschedule the exercise', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_WHEN_RESCHEDULE, callback);
});

When('user chooses the time', function (callback) {
  sendPatientMsg(context.constants.TIME_CHOICE, callback);
});

Then('therapist confirms that a new time has been chosen', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_CONFIRM_TIME, callback);
});

When('user responds now', function (callback) {
  sendPatientMsg(context.constants.NOW, callback);
});

When('user selects words', function (callback) {
  sendPatientMsg(context.constants.SELECTED_SMOKING_WORDS, callback);
});

Then('therapist asks confirmation of the words', function (callback) {
  verifyRasaResponse(context.constants.SELECTED_SMOKING_WORDS, callback);
});

Then('the words are stored in the DB', function (callback) {
     context.client.query('SELECT * FROM dialog_answers order by answer_id desc limit 1', (err, res) => {
      if (err) {
        callback('DB reading error')
      } else {
      console.log('DB content: ', res.rows[0]);
        assert(res.rows[0]['question_id']==1);
        assert(res.rows[0]['users_nicedayuid']==context.user_id);
        assert(res.rows[0]['answer']==context.constants.SELECTED_SMOKING_WORDS);
        callback();
      }
     })
});

When('user responds with free text', function (callback) {
  sendPatientMsg(context.constants.FREE_TEXT_ANSWER, callback);
});

Then('the why smoker answer text answer is stored in the DB', function (callback) {
 setTimeout(function(){
  context.client.query('SELECT * FROM dialog_answers order by answer_id desc limit 1', (err, res) => {
   if (err) {
    callback('DB reading error')
   } else {
   console.log('DB content: ', res.rows[0]);
    assert(res.rows[0]['question_id']==2);
    assert(res.rows[0]['users_nicedayuid']==context.user_id);
    assert(res.rows[0]['answer']==context.constants.FREE_TEXT_ANSWER);
    callback();
   }
  })
 },2000); //wait 500ms to have the time to complete the DB writing
});