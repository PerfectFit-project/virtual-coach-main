Feature: First aid kit

  Scenario: Get first aid kit
     Given rasa bot is up and running
       And the connection to the database is successful
      When user is authenticated

      Then test user is connected
       And the conversation is restarted
      When we ask for the first aid kit
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And first aid kit is printed
       


