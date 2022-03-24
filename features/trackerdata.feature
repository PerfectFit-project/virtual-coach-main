Feature: Get tracker data

 Scenario: Get data from tracker
     Given rasa bot is up and running
      When user is authenticated
      Then test user is connected
      When users asks for consumed cigarettes
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist responds with the number of tracked cigarettes
