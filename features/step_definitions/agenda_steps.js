const { Before, Given, When, Then } = require('cucumber')
const http = require('http')

const RASA_URL = 'http://localhost:5005';

Given('rasa bot is up and running', function (callback) {

  http.get(RASA_URL, (res) => {
    const { statusCode } = res;

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
      callback(error);
    } else {
      callback();
    }
  });

});


