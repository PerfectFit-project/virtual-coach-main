Feature: Future self dialog

  Scenario: Reschedule future self dialog
     Given rasa bot is up and running
       And the connection to the database is successful
      When user is authenticated
      Then test user is connected
       And the conversation is restarted
      When user starts future self dialog
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist responds by greeting the user using the correct name
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist introduces the exercise
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist says the exercise name
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist says the exercise duration
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist says to do it at once
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks when to do the exercise
      When user responds later
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist responds by confirming the later choice
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks when to reschedule the exercise
      When user chooses the time
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist confirms that a new time has been chosen

  Scenario: Perform future self dialog
     Given rasa bot is up and running
       And the connection to the database is successful
      When user is authenticated
      Then test user is connected
       And the conversation is restarted
      When user starts future self dialog
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist responds by greeting the user using the correct name
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist introduces the exercise
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist says the exercise name
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist says the exercise duration
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist says to do it at once
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks when to do the exercise
      When user responds now
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
      When user selects smoker words
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And therapist asks confirmation of the words
      When user responds yes
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And the smoker words are stored in the DB
      When user responds with free text
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And the smoker words answer is stored in the DB
      When user selects mover words
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
      When user responds yes
      Then the message is addressed to the therapist
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And the mover words are stored in the DB
      When user responds with free text
      Then the message is addressed to the therapist
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And the mover words answer is stored in the DB
      When user chooses option 1
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist responds by confirming the option 1 choice
      When user responds yes
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
      When user chooses option 1
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist responds by confirming the option 1 choice
      When user responds yes
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a response
       And therapist response is found to be addressed to the user
      When user responds with free text
      Then the message is addressed to the therapist
       And therapist produces a response
       And therapist response is found to be addressed to the user
      When user responds with free text
      Then the message is addressed to the therapist
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And the dialog is concluded