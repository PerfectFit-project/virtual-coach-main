Feature: First aid kit

  Scenario: Get first aid kit
     Given rasa bot is up and running
       And the connection to the database is successful
      When user is authenticated

      Then test user is connected
       And the conversation is restarted
      When we ask for the profle creation dialog
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And profile creation rescheduling one is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation rescheduling two is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation rescheduling three is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation rescheduling four is printed
      When user gives the profile creation rescheduling answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And profile creation rescheduling five is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation start one is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation start two is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation start three is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation code one is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation code two is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation ask code slot is printed
	  When user gives the profile creation code answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And profile creation code three is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation preference one is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation preference two is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation preference three is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation ask day slot is printed
	  When user gives the profile creation day slot answer one
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And profile creation day not valid is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation ask day slot is printed
	  When user gives the profile creation day slot answer two
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And profile creation preference four is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation preference five is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation ask time slot is printed
	  When user gives the profile creation time slot answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And profile creation preference six is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation ask confirm preference slot is printed
	  When user gives the profile creation confirm preference slot answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   