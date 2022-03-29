Feature: Greetings

 Scenario: Greetings and user expresses positive mood
     Given rasa bot is up and running
      When user is authenticated
      Then test user is connected
       And the conversation is restarted
      When users says hi
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist responds by greeting the user using the correct name
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks for the user mood
      When users responds with positive mood
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist congratulates

 Scenario: Greetings and user expresses negative mood
     Given rasa bot is up and running
      When user is authenticated
      Then test user is connected
       And the conversation is restarted
      When users says hi
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist responds by greeting the user using the correct name
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks for the user mood
      When users responds with negative mood
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist is sorry