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

// Here not the response text has to be equal to one of the options in expected_response.
// Instead, is enough if one of the options in expected_response is contained in the response text.
function verifyRasaResponseMultiplePartial(expected_response, callback){
  assert(context.hasOwnProperty("therapist_response"));
  assert(context.therapist_response.hasOwnProperty("content"));
  assert(context.therapist_response['content'].hasOwnProperty("TEXT"));
  for (var i = 0; i < expected_response.length; i++){
	  if (context.therapist_response['content']['TEXT'].includes(expected_response[i])){
		  callback();
	  }
  }
  callback('Error: No expected response option contained in response text: ', context.therapist_response['content']['TEXT']);
}

function verifyRasaResponseMultiple(expected_response, callback){
  assert(context.hasOwnProperty("therapist_response"));
  assert(context.therapist_response.hasOwnProperty("content"));
  assert(context.therapist_response['content'].hasOwnProperty("TEXT"));
  assert(expected_response.includes(context.therapist_response['content']['TEXT']));
  callback();
}

function isFutureSelfRepetition(callback){
	context.client.query('SELECT * FROM user_intervention_state WHERE users_nicedayuid = $1 AND intervention_component = $2',
					     [context.user_id, "future_self_dialog"],
					     (err, res) => {
      if (err) {
        callback('DB reading error ' + err);
      } else {
		console.log('Number of rows for future self dialog for user in user intervention state:', res.rows.length)
		// Number of rows indicates whether the user has done the future self dialog before
		var repetition = 1;
		if (res.rows.length < 1){
			repetition = 0;
		}
		callback(null, repetition);
	  }
    })
}

function getUserParticipantCodeFromDB(callback){
	context.client.query('SELECT * FROM users WHERE nicedayuid = $1',
					     [context.user_id],
					     (err, res) => {
      if (err) {
        callback('DB reading error ' + err);
      } else {
		if (res.rows.length < 1){
			callback("User not in DB");
		}
		participant_code = res.rows[0].participant_code;
		callback(null, participant_code);
	  }
    })
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

When('we ask for the first aid kit', function (callback) {
  sendPatientMsg(context.constants.ASK_FIRSTAIDKIT, callback);
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

Then('first aid kit intro is printed', function(callback){
  context.client.query('SELECT * FROM first_aid_kit WHERE users_nicedayuid = $1', [context.user_id], (err, res) => {
      if (err) {
        callback('DB reading error')
      } else{
		if (res.rows.length > 0){
			verifyRasaResponseMultiple(context.constants.FIRST_AID_KIT_INTRO_PRINT, callback);
		} else{
			verifyRasaResponse(context.constants.FIRST_AID_KIT_EMPTY, callback);
		}
	  }
  })
});

Then('first aid kit content is printed', function (callback) {
  verifyRasaResponseMultiplePartial(context.constants.FIRST_AID_KIT_CONTENT_PRINT, callback);
});

Then('first aid kit show activity titles two is printed', function (callback) {
  verifyRasaResponseMultiple(context.constants.FIRST_AID_KIT_SHOW_ACTIVITY_TITLES_TWO_PRINT, callback);
});

Then('first aid kit chosen activity slot intro is printed', function (callback) {
  verifyRasaResponseMultiple(context.constants.FIRST_AID_KIT_CHOSEN_ACTIVITY_SLOT_INTO_PRINT, callback);
});

When('user gives the chosen activity slot', function (callback) {
  sendPatientMsg(context.constants.FIRST_AID_KIT_CHOSEN_ACTIIVTY_SLOT, callback);
});

Then('first aid kit show full text noinput one is printed', function (callback) {
  verifyRasaResponseMultiplePartial(context.constants.FIRST_AID_KIT_SHOW_FULL_TEXT_NOINPUT_ONE_PRINT, callback);
});

Then('first aid kit show full text noinput two is printed', function (callback) {
  verifyRasaResponseMultiple(context.constants.FIRST_AID_KIT_SHOW_FULL_TEXT_NOINPUT_TWO_PRINT, callback);
});

Then('first aid kit end or repeat is printed', function (callback) {
  verifyRasaResponseMultiple(context.constants.FIRST_AID_KIT_END_OR_REPEAT_PRINT, callback);
});

Then('first aid kit end slot ask is printed', function (callback) {
  verifyRasaResponseMultiple(context.constants.FIRST_AID_KIT_END_SLOT_ASK, callback);
});

When('user gives the first aid kit end slot', function (callback) {
  sendPatientMsg(context.constants.FIRST_AID_KIT_END_SLOT, callback);
});

Then('first aid kit end one is printed', function (callback) {
  verifyRasaResponseMultiple(context.constants.FIRST_AID_KIT_END_ONE_PRINT, callback);
});

Then('first aid kit end two is printed', function (callback) {
  verifyRasaResponseMultiple(context.constants.FIRST_AID_KIT_END_TWO_PRINT, callback);
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
	
	// Check if user has done future self dialog before based on database
	isFutureSelfRepetition( (err, repetition) => {
		if (err){
			callback("Error: " + err);
		}
		else{
			if (repetition===0){
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
  verifyRasaResponseMultiplePartial(context.constants.EXPECTED_NOW_OR_LATER, callback);
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
  verifyRasaResponse(context.constants.EXPECTED_CONFIRM_NOW, callback);
});

Then('therapist explains the future self dialog', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_FUTURE_SELF_EXPLANATION, callback);
});

Then('therapist asks which kind of smoker the user is', function (callback) {
	
	// Check if user has done future self dialog before based on database
	isFutureSelfRepetition( (err, repetition) => {
		if (err){
			callback("Error: " + err);
		}
		else{
			if (repetition===0){
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
  
	// Check if user has done future self dialog before based on database
	isFutureSelfRepetition( (err, repetition) => {
		if (err){
			callback("Error: " + err);
		}
		else{
			if (repetition === 0){
				verifyRasaResponse(context.constants.EXPECTED_CURRENT_MOVER_LIST_INTRODUCTION, callback);
			} else{
				verifyRasaResponse(context.constants.EXPECTED_CURRENT_MOVER_LIST_INTRODUCTION_REPETITION, callback);
			}
		}
	});
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

// general activity
When('user starts general activity dialog', function (callback) {
  sendPatientMsg(context.constants.START_GENERAL_ACTIVITY, callback);
});

Then('therapist responds by greeting the user', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_GREETINGS, callback);
});

Then('therapist says that user can do a new activity', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_CAN_DO_NEW_ACTIVITY, callback);
});

Then('therapist says the duration of the general activity dialog', function (callback) {
  verifyRasaResponse(context.constants.GENERAL_ACTIVITY_EXPECTED_DURATION, callback);
});

Then('therapist responds by asking a rating', function (callback) {
  	context.client.query('SELECT * FROM intervention_activities_performed iap join intervention_activity ia on iap.intervention_activity_id = ia.intervention_activity_id WHERE users_nicedayuid = $1 ORDER BY intervention_activities_performed_id DESC LIMIT 1',
					     [context.user_id],
					     (err, res) => {
      if (err) {
        callback('DB reading error ' + err);
      } else {
      verifyRasaResponse(res.rows[0]['intervention_activity_title'], callback);
      context.constants.ACTIVITY_ID = res.rows[0]['intervention_activity_id']
    }
    });
});

When('user gives the rating', function (callback) {
  sendPatientMsg(context.constants.ACTIVITY_RATING, callback);
});

Then('therapist thanks for the feedback', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_THANKS_FOR_FEEDBACK, callback);
});

Then('therapist thanks for the sharing', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_THANKS_FOR_SHARING, callback);
});

Then('therapist introduces the state question answering', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_INTRO_STATE_QUESTION_ANSWERING, callback);
});

Then('therapist asks question state question answering', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_QUESTION_STATE_QUESTION_ANSEWRING, callback);
});

Then('therapist asks prompts state question', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_PROMPTS_STATE_QUESTION, callback);
});

Then('therapist lists state question answer options', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_STATE_QUESTION_RATING_OPTIONS, callback);
});

When('user gives the prompts rating', function (callback) {
  sendPatientMsg(context.constants.STATE_PROMPTS_RATING, callback);
});

Then('therapist asks want state question', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_WANT_STATE_QUESTION, callback);
});
  
When('user gives the want rating', function (callback) {
  sendPatientMsg(context.constants.STATE_WANT_RATING, callback);
});

Then('therapist asks need state question', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_NEED_STATE_QUESTION, callback);
});
  
When('user gives the need rating', function (callback) {
  sendPatientMsg(context.constants.STATE_NEED_RATING, callback);
});

Then('therapist thanks state question answering', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_THANK_STATE_QUESTION_ANSWERING, callback);
});

Then('therapist persuades with commitment', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_PERSUASION_COMMITMENT, callback);
});

Then('therapist asks commitment reflective question', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_REFLECTIVE_QUESTION_COMMITMENT, callback);
});

When('user gives the reflection', function (callback) {
  sendPatientMsg(context.constants.REFLECTION_ANSWER, callback);
});

Then('therapist thanks for the reflection', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_REFLECTION_THANKS, callback);
});

Then('therapist introduces new activity text', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_NEW_ACTIVITY_TEXT_INTRO, callback);
});

Then('therapist displays the last input', function (callback) {
  	context.client.query('SELECT * FROM intervention_activities_performed WHERE users_nicedayuid = $1 and intervention_activity_id = $2',
					     [context.user_id, context.constants.ACTIVITY_ID],
					     (err, res) => {
      if (err) {
        callback('DB reading error ' + err);
      } else {
      verifyRasaResponse(res.rows[0]['user_input'], callback);
    }
    });
});

Then('therapist asks to edit or save', function (callback) {
  verifyRasaResponseMultiplePartial(context.constants.EXPECTED_EDIT_SAVE, callback);
});

When('user chooses to edit', function (callback) {
  sendPatientMsg(context.constants.EDIT_SELECTION, callback);
});

Then('therapist says prima', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_PRIMA, callback);
});

Then('therapist asks a new input', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_NEW_INPUT_1, callback);
});

Then('therapist instructs to write the input', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_NEW_INPUT_2, callback);
});

When('user gives the input', function (callback) {
  sendPatientMsg(context.constants.NEW_INPUT, callback);
});

Then('the new input is saved on the DB', function (callback) {
  	context.client.query('SELECT * FROM intervention_activities_performed WHERE users_nicedayuid = $1 and intervention_activity_id = $2',
					     [context.user_id, context.constants.ACTIVITY_ID],
					     (err, res) => {
      if (err) {
        callback('DB reading error ' + err);
      } else {
        assert(res.rows[0]['user_input'] == context.constants.NEW_INPUT);
        callback();
    }
    });
});

Then('therapist thanks for the input', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_THANKS_FOR_INPUT, callback);
});

Then('therapist introduces new activity', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_NEW_ACTIVITY_INTRO, callback);
});

Then('therapist produces a list of activity types', function (callback) {
  const ActivitiesList = context.therapist_response['content']['TEXT'];
  const SplitList = ActivitiesList.split("'");
  const ActivityOne = SplitList[1];
  context.constants.NEW_ACTIVITY_TITLE = ActivityOne
  verifyRasaResponse(context.constants.EXPECTED_NEW_ACTIVITIES_LIST, callback);
});

When('user selects the new activity type', function (callback) {
  sendPatientMsg(context.constants.NEW_ACTIVITY_SELECTION, callback);
});

Then('therapist says good activity type chosen', function (callback) {
  verifyRasaResponseMultiple(context.constants.EXPECTED_GENERAL_ACTIVITY_GOOD_ACTIVITY_TYPE_CHOSEN, callback);
});

Then('therapist asks to pick an activity from the type', function (callback) {
  verifyRasaResponse(context.constants.EXPECTED_GENERAL_ACTIVITY_ASK_FOR_ACTIVITY, callback);
});

When('user selects the new activity', function (callback) {
  sendPatientMsg(context.constants.NEW_ACTIVITY_SELECTION, callback);
});

Then('therapist says good choice', function (callback) {
  verifyRasaResponseMultiplePartial(context.constants.EXPECTED_GOOD_CHOICE, callback);
});

Then('therapist shows new activity', function (callback) {
  	context.client.query('SELECT * FROM intervention_activity WHERE intervention_activity_title = $1',
					     [context.constants.NEW_ACTIVITY_TITLE],
					     (err, res) => {
      if (err) {
        callback('DB reading error ' + err);
      } else {
        verifyRasaResponse(res.rows[0]['intervention_activity_full_instructions'], callback);
	  }
    });
});

Then('the new activity is saved in the DB', function (callback) {
  	context.client.query('SELECT * FROM intervention_activities_performed iap join intervention_activity ia on iap.intervention_activity_id = ia.intervention_activity_id WHERE users_nicedayuid = $1 ORDER BY intervention_activities_performed_id DESC LIMIT 1',
					     [context.user_id],
					     (err, res) => {
      if (err) {
        callback('DB reading error ' + err);
      } else {
        assert(res.rows[0]['intervention_activity_title'] == context.constants.NEW_ACTIVITY_TITLE);
        context.constants.LAST_ACTIVITY_ROW_ID = res.rows[0]['intervention_activities_performed_id'];
        callback();
    }
    });
});

Then('clean DB for further iterations', function (callback) {
  	context.client.query('DELETE FROM intervention_activities_performed WHERE intervention_activities_performed_id = $1',
					     [context.LAST_ACTIVITY_ROW_ID],
					     (err, res) => {
      if (err) {
        callback('DB reading error ' + err);
      } else {
        callback();
    }
    });
});

//
// PROFILE CREATION DIALOG
//

When('we ask for the profile creation dialog', function (callback) {
  sendPatientMsg(context.constants.ASK_PROFILE_CREATION_DIALOG, callback);
});

Then('profile creation rescheduling one is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_RESCHEDULING_ONE_PRINT, callback);
});

Then('profile creation rescheduling two is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_RESCHEDULING_TWO_PRINT, callback);
});

Then('profile creation rescheduling three is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_RESCHEDULING_THREE_PRINT, callback);
});

Then('profile creation rescheduling four is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_RESCHEDULING_FOUR_PRINT, callback);
});

When('user gives the profile creation rescheduling answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_RESCHEDULING_ANSWER, callback);
});

Then('profile creation rescheduling five is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_RESCHEDULING_FIVE_PRINT, callback);
});

Then('profile creation start one is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_START_ONE_PRINT, callback);
});

Then('profile creation start two is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_START_TWO_PRINT, callback);
});

Then('profile creation start three is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_START_THREE_PRINT, callback);
});

Then('profile creation start three part two is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_START_THREE_PRINT_TWO, callback);
});

Then('profile creation code one is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_CODE_ONE_PRINT, callback);
});

Then('profile creation code two is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_CODE_TWO_PRINT, callback);
});

Then('profile creation ask code slot is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_ASK_CODE_SLOT_PRINT, callback);
});

When('user gives the profile creation code answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_CODE_ANSWER, callback);
});

Then('profile creation code three is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_CODE_THREE_PRINT, callback);
});

Then('profile creation preference one is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_PREFERENCE_ONE_PRINT, callback);
});

Then('profile creation preference two is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_PREFERENCE_TWO_PRINT, callback);
});

Then('profile creation preference three is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_PREFERENCE_THREE_PRINT, callback);
});

Then('profile creation ask day slot is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_ASK_DAY_SLOT_PRINT, callback);
});

When('user gives the profile creation day slot answer one', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_DAY_SLOT_ANSWER_ONE, callback);
});

Then('profile creation day not valid is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_DAY_NOT_VALID_PRINT, callback);
});

When('user gives the profile creation day slot answer two', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_DAY_SLOT_ANSWER_TWO, callback);
});

Then('profile creation preference four is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_PREFERENCE_FOUR_PRINT, callback);
});

Then('profile creation preference five is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_PREFERENCE_FIVE_PRINT, callback);
});

Then('profile creation ask time slot is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_ASK_TIME_SLOT, callback);
});

When('user gives the profile creation time slot answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_TIME_SLOT_ANSWER, callback);
});

Then('validate profile creation time slot is printed', function (callback) {
  verifyRasaResponse(context.constants.VALIDATE_PROFILE_CREATION_TIME_SLOT_PRINT, callback);
});

Then('profile creation ask confirm preference slot is printed', function (callback) {
  verifyRasaResponse(context.constants.PROFILE_CREATION_ASK_CONFIRM_PREFERENCE_SLOT_PRINT, callback);
});

When('user gives the profile creation time confirm preference slot answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_CONFIRM_PREFERENCE_SLOT_ANSWER, callback);
});

When('user gives the profile creation time confirm preference slot answer confirm', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_CONFIRM_PREFERENCE_SLOT_ANSWER_CONFIRM, callback);
});

Then('profile creation utter profile creation testim 1', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_TESTIM_1, callback);
});

Then('profile creation utter profile creation testim 2', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_TESTIM_2, callback);
});

Then('utter ask profile creation run walk slot', function (callback) {
  verifyRasaResponse(context.constants.UTTER_ASK_PROFILE_CREATION_RUN_WALK_SLOT, callback);
});

When('user gives the profile creation run walk slot 3 answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_RUN_WALK_SLOT_ANSWER_3, callback);
});

Then('utter profile creation run walk slot not valid', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_RUN_WALK_SLOT_NOT_VALID, callback);
});

When('user gives the profile creation run walk slot 2 answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_RUN_WALK_SLOT_ANSWER_2, callback);
});


Then('utter profile creation godin 1', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_GODIN_1, callback);
});

Then('utter profile creation ask profile creation light slot', function (callback) {
  verifyRasaResponse(context.constants.UTTER_ASK_PROFILE_CREATION_GODIN_LIGHT_SLOT, callback);
});

When('user gives the profile creation godin light slot answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_GODIN_LIGHT_SLOT_ANSWER, callback);
});

Then('utter profile creation ask profile creation moderate slot', function (callback) {
  verifyRasaResponse(context.constants.UTTER_ASK_PROFILE_CREATION_GODIN_MODERATE_SLOT, callback);
});

When('user gives the profile creation godin moderate slot answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_GODIN_MODERATE_SLOT_ANSWER, callback);
});

Then('utter profile creation ask profile creation intensive slot', function (callback) {
  verifyRasaResponse(context.constants.UTTER_ASK_PROFILE_CREATION_GODIN_INTENSIVE_SLOT, callback);
});

When('user gives the profile creation godin intensive slot answer invalid', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_GODIN_INTENSIVE_SLOT_ANSWER_INVALID, callback);
});

Then('utter please answer number', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PLEASE_ANSWER_NUMBER, callback);
});

When('user gives the profile creation godin intensive slot answer valid', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_GODIN_INTENSIVE_SLOT_ANSWER_VALID, callback);
});

Then('utter profile creation godin 2', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_GODIN_2, callback);
});


Then('utter profile creation sim 1', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_1, callback);
});

Then('utter profile creation sim 2', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_2, callback);
});

Then('utter profile creation sim 3', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_3, callback);
});

Then('utter profile creation sim 4', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_4, callback);
});

Then('utter profile creation sim 5', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_5, callback);
});

Then('utter profile creation sim 6', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_6, callback);
});

Then('utter profile creation sim 7', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_7, callback);
});

Then('utter profile creation sim 8', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_8, callback);
});

Then('utter profile creation sim 9', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_SIM_9, callback);
});

Then('utter ask profile creation sim slot', function (callback) {
  verifyRasaResponse(context.constants.UTTER_ASK_PROFILE_CREATION_SIM_SLOT, callback);
});

When('user gives the profile creation sim answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_SIM_ANSWER, callback);
});


Then('utter profile creation conf 1', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_CONF_1, callback);
});

Then('utter ask profile creation conf 1 slot', function (callback) {
  verifyRasaResponse(context.constants.UTTER_ASK_PROFILE_CREATION_CONF_1_SLOT, callback);
});

Then('utter ask profile creation conf 2 slot', function (callback) {
  verifyRasaResponse(context.constants.UTTER_ASK_PROFILE_CREATION_CONF_2_SLOT, callback);
});

When('user gives the profile creation conf 1 slot answer', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_CONF_1_SLOT_ANSWER, callback);
});

When('user gives the profile creation conf 2 slot answer invalid', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_CONF_2_SLOT_ANSWER_INVALID, callback);
});

Then('utter please answer 0 to 10', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PLEASE_ANSWER_0_TO_10, callback);
});

When('user gives the profile creation conf 2 slot answer valid', function (callback) {
  sendPatientMsg(context.constants.PROFILE_CREATION_CONF_2_SLOT_ANSWER_VALID, callback);
});


Then('utter profile creation closing 1', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_CLOSING_1, callback);
});

Then('utter profile creation closing 2', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_CLOSING_2, callback);
});

Then('utter profile creation closing 3', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_CLOSING_3, callback);
});

Then('utter profile creation closing 4', function (callback) {
  verifyRasaResponse(context.constants.UTTER_PROFILE_CREATION_CLOSING_4, callback);
});

Then('user participant code is in db', function (callback) {
  
	// Get participant code for user from db
	getUserParticipantCodeFromDB( (err, participant_code) => {
		if (err){
			callback("Error: " + err);
		}
		else{
			if (participant_code == context.constants.PROFILE_CREATION_CODE_ANSWER) {
			callback();
		    }
		    callback('Error: ', participant_code);
		}
	});
});