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
	   And therapist says that user can do a new activity
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And therapist says the duration of the general activity dialog
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks when to do the exercise
      When user responds now
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist confirms to do it now
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist responds by asking a rating
      When user gives the rating
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist thanks for the sharing
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist responds by asking a rating
      When user gives the rating
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist thanks for the feedback
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist displays the last input
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks to edit or save
      When user chooses to edit
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist says prima
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks a new input
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist instructs to write the input
      When user gives the input
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist thanks for the input
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist introduces new activity
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist produces a list of activity types
      When user selects the new activity type
      Then the message is addressed to the therapist
      When therapist produces a response
	   And therapist response is found to be addressed to the user
       And therapist says good activity type chosen
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks to pick an activity from the type
	  When user selects the new activity
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist says good choice
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist introduces the state question answering
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks question state question answering
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks prompts state question
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist lists state question answer options
	  When user gives the prompts rating
      Then the message is addressed to the therapist
      When therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist asks want state question
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist lists state question answer options
	  When user gives the want rating
      Then the message is addressed to the therapist
      When therapist produces a response
	   And therapist response is found to be addressed to the user
	   And therapist asks need state question
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist lists state question answer options
	  When user gives the need rating
      Then the message is addressed to the therapist
      When therapist produces a response
	   And therapist response is found to be addressed to the user
	   And therapist thanks state question answering
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And therapist persuades with commitment
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And therapist asks commitment reflective question
	  When user gives the reflection
	  Then the message is addressed to the therapist
      When therapist produces a response
	   And therapist response is found to be addressed to the user
	   And therapist thanks for the reflection
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And therapist introduces new activity text
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist shows new activity
       And the new activity is saved in the DB