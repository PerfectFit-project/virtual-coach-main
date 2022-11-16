Feature: General activity dialog

  Scenario: Run general activity dialog
     Given rasa bot is up and running
       And the connection to the database is successful
      When user is authenticated
      Then test user is connected
       And the conversation is restarted
      When user starts general activity dialog
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist responds by greeting the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks when to do the exercise
      When user responds now
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist responds by asking a rating
       And therapist produces a response
       And therapist response is found to be addressed to the user