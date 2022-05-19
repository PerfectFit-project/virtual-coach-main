const { Before, Given, When, Then } = require('cucumber')
require('isomorphic-fetch');
const assert = require('assert');
const { Chat, SenseServerEnvironment, ConnectionStatus, Authentication, SenseServer } = require('@sense-os/goalie-js')
const { Client } = require('pg');
var fs = require('fs');

var {setDefaultTimeout} = require('@cucumber/cucumber');

// Read in environment variables from .env file
require('dotenv').config();

const { THERAPIST_ID } = process.env;

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
  callback('Error: ', context.therapist_response['content']['TEXT']);
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
  assert(context.patient_message_response['to'] == THERAPIST_ID);
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
  context.client.query('SELECT * FROM user_intervention_state WHERE users_nicedayuid = $1 AND intervention_component = $2', 
					   [context.user_id, "future_self_dialog"], 
					   (err, res) => {
      if (err) {
        callback('DB reading error' + err)
      } else {
		console.log('Number of rows for future self dialog for user in user intervention state:', res.rows.length)
		if (res.rows.length < 1){
			verifyRasaResponse(context.constants.EXPECTED_EXERCISE_NAME, callback);
		} else{
			verifyRasaResponseMultiple(context.constants.EXPECTED_EXERCISE_NAME_REPEATED, callback);
		}
	  }
  })
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
	
	// Get current hour in timezone
	var current_hour_str = new Date().toLocaleString("en-US", {timeZone: context.constants.TIMEZONE, hour:'2-digit', hour12:false})
	var current_hour = parseInt(current_hour_str)
	
	if (current_hour < context.constants.NIGHT_END){
    verifyRasaResponse(context.constants.EXPECTED_WHEN_RESCHEDULE_NIGHT, callback);
   } else if (current_hour < context.constants.MORNING_END){
	verifyRasaResponse(context.constants.EXPECTED_WHEN_RESCHEDULE_MORNING, callback);
   } else if (current_hour < context.constants.AFTERNOON_END){
	verifyRasaResponse(context.constants.EXPECTED_WHEN_RESCHEDULE_AFTERNOON, callback);
   } else {
    verifyRasaResponse(context.constants.EXPECTED_WHEN_RESCHEDULE_EVENING, callback);
   }
  
});

When('user chooses option 1', function (callback) {
  sendPatientMsg(context.constants.OPTION_1, callback);
});

Then('therapist confirms that a new time has been chosen', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_CONFIRM_TIME, callback);
});

When('user responds now', function (callback) {
  sendPatientMsg(context.constants.NOW, callback);
});

Then('therapist confirms to do it now', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_CONFIRM_NOW, callback);
});

Then('therapist explains the future self dialog', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_FUTURE_SELF_EXPLANATION, callback);
});

Then('therapist asks which kind of smoker the user is', function (callback) {
  context.client.query('SELECT * FROM user_intervention_state WHERE users_nicedayuid = $1 AND intervention_component = $2', 
                       [context.user_id, "future_self_dialog"], 
					   (err, res) => {
      if (err) {
        callback('DB reading error' + err)
      } else {
		console.log('Number of rows for future self dialog for user in user intervention state:', res.rows.length)
		if (res.rows.length < 1){
			verifyRasaResponse(context.constants.EXPECTED_WHAT_SMOKER, callback);
		} else{
			verifyRasaResponse(context.constants.EXPECTED_WHAT_SMOKER_REPEATED, callback);
		}
	  }
  })
});

Then('therapist shows the smoking words list', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_SMOKING_WORDS_LIST, callback);
});

Then('therapist asks to pick words', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_PICK_WORDS_REQUEST, callback);
});

When('user selects smoker words', function (callback) {
  sendPatientMsg(context.constants.SELECTED_SMOKER_WORDS, callback);
});

Then('therapist asks confirmation of the words', function (callback) {
  verifyRasaResponse(context.constants.SELECTED_SMOKER_WORDS, callback);
});

Then('the smoker words are stored in the DB', function (callback) {
  context.client.query('SELECT * FROM dialog_answers order by answer_id desc limit 1', (err, res) => {
      if (err) {
        callback('DB reading error')
      } else {
      console.log('DB content: ', res.rows[0]);
        assert(res.rows[0]['question_id']==1);
        assert(res.rows[0]['users_nicedayuid']==context.user_id);
        assert(res.rows[0]['answer']==context.constants.SELECTED_SMOKER_WORDS);
        callback();
      }
  })
});

Then('therapist says good', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_UTTER_GOOD, callback);
});

Then('therapist asks why smoker words', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_WHY_SMOKER_WORDS, callback);
});

When('user responds with free text', function (callback) {
  sendPatientMsg(context.constants.FREE_TEXT_ANSWER, callback);
});

Then('therapist responds on the words explanation', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_WHY_WORDS_RESPONSE, callback);
});

Then('the smoker words answer is stored in the DB', function (callback) {
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
});

Then('therapist introduces current mover', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_CURRENT_MOVER_INTRODUCTION, callback);
});

Then('therapist introduces current mover words list', function (callback) {
  context.client.query('SELECT * FROM user_intervention_state WHERE users_nicedayuid = $1 AND intervention_component = $2', 
                       [context.user_id, "future_self_dialog"], 
					   (err, res) => {
      if (err) {
        callback('DB reading error: ' + err)
      } else {
		console.log('Number of rows for future self dialog for user in user intervention state:', res.rows.length)
		if (res.rows.length < 1){
			verifyRasaResponse(context.constants.EXPECTED_CURRENT_MOVER_LIST_INTRODUCTION, callback);
		} else{
			verifyRasaResponse(context.constants.EXPECTED_CURRENT_MOVER_LIST_INTRODUCTION_REPETITION, callback);
		}
	  }
  })
});

Then('therapist shows current mover words list', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_MOVER_WORDS_LIST, callback);
});

When('user selects mover words', function (callback) {
  sendPatientMsg(context.constants.SELECTED_MOVER_WORDS, callback);
});

Then('the mover words are stored in the DB', function (callback) {
  context.client.query('SELECT * FROM dialog_answers order by answer_id desc limit 1', (err, res) => {
   if (err) {
    callback('DB reading error')
   } else {
   console.log('DB content: ', res.rows[0]);
    assert(res.rows[0]['question_id']==3);
    assert(res.rows[0]['users_nicedayuid']==context.user_id);
    assert(res.rows[0]['answer']==context.constants.SELECTED_MOVER_WORDS);
    callback();
   }
  })
});

Then('therapist asks confirmation of the mover words', function (callback) {
  verifyRasaResponse(context.constants.SELECTED_MOVER_WORDS, callback);
});

Then('therapist asks why mover words', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_WHY_MOVER_WORDS, callback);
});

Then('the mover words answer is stored in the DB', function (callback) {
  context.client.query('SELECT * FROM dialog_answers order by answer_id desc limit 1', (err, res) => {
   if (err) {
    callback('DB reading error')
   } else {
   console.log('DB content: ', res.rows[0]);
    assert(res.rows[0]['question_id']==4);
    assert(res.rows[0]['users_nicedayuid']==context.user_id);
    assert(res.rows[0]['answer']==context.constants.FREE_TEXT_ANSWER);
    callback();
   }
  })
});

Then('the mover identity answer is stored in the DB', function (callback) {
  context.client.query('SELECT * FROM dialog_answers order by answer_id desc limit 1', (err, res) => {
   if (err) {
    callback('DB reading error')
   } else {
   console.log('DB content: ', res.rows[0]);
    assert(res.rows[0]['question_id']==6);
    assert(res.rows[0]['users_nicedayuid']==context.user_id);
    assert(res.rows[0]['answer']==context.constants.OPTION_1);
    callback();
   }
  })
});

Then('the smoker identity answer is stored in the DB', function (callback) {
  context.client.query('SELECT * FROM dialog_answers order by answer_id desc limit 1', (err, res) => {
   if (err) {
    callback('DB reading error')
   } else {
   console.log('DB content: ', res.rows[0]);
    assert(res.rows[0]['question_id']==5);
    assert(res.rows[0]['users_nicedayuid']==context.user_id);
    assert(res.rows[0]['answer']==context.constants.OPTION_1);
    callback();
   }
  })
});

Then('therapist introduces self view', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_SELF_VIEW_INTRODUCTION, callback);
});

Then('therapist shows self view options', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_SELF_VIEW_OPTIONS, callback);
});

Then('therapist responds by confirming the option 1 choice', function (callback) {
  verifyRasaResponse(context.constants.OPTION_1, callback);
});

Then('therapist says leuk', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_LEUK, callback);
});

Then('therapist shows self mover view options', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_SELF_MOVER_VIEW_OPTIONS, callback);
});

Then('therapist asks to choose an option', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_CHOOSE_OPTION, callback);
});

Then('therapist says fijn', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_FIJN, callback);
});

Then('therapist asks why the smoker definition', function (callback) {
  verifyRasaResponse(context.constants.SEE_MYSELF_SMOKER_TEXT, callback);
});

Then('therapist asks why the mover definition', function (callback) {
  verifyRasaResponse(context.constants.SEE_MYSELF_MOVER_TEXT, callback);
});

Then('the dialog is concluded', function (callback) {
  context.client
   .end()
   .then(() =>callback())
   .catch(err => callback(err));
});
