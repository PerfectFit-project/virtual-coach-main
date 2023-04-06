Feature: First aid kit

  Scenario: Get first aid kit
     Given rasa bot is up and running
       And the connection to the database is successful
      When user is authenticated

      Then test user is connected
       And the conversation is restarted
      When we ask for the profile creation dialog
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
       And profile creation start three part two is printed
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
	   And validate profile creation time slot is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation ask confirm preference slot is printed
	  When user gives the profile creation time confirm preference slot answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
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
	   And validate profile creation time slot is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And profile creation ask confirm preference slot is printed
	  When user gives the profile creation time confirm preference slot answer confirm
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And profile creation utter profile creation testim 1
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And profile creation utter profile creation testim 2
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter ask profile creation run walk slot
	  When user gives the profile creation run walk slot 3 answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation run walk slot not valid
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter ask profile creation run walk slot
	  When user gives the profile creation run walk slot 2 answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation godin 1
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation ask profile creation light slot
	  When user gives the profile creation godin light slot answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation ask profile creation moderate slot
	  When user gives the profile creation godin moderate slot answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation ask profile creation intensive slot
	  When user gives the profile creation godin intensive slot answer invalid
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter please answer number
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation ask profile creation intensive slot
	  When user gives the profile creation godin intensive slot answer valid
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation godin 2
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation sim 1
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation sim 2
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter ask profile creation sim slot
	  When user gives the profile creation sim answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation sim 3
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation sim 4
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter ask profile creation sim slot
	  When user gives the profile creation sim answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation sim 5
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation sim 6
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter ask profile creation sim slot
	  When user gives the profile creation sim answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation sim 7
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation sim 8
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter ask profile creation sim slot
	  When user gives the profile creation sim answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation sim 9
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation conf 1
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter ask profile creation conf 1 slot
	  When user gives the profile creation conf 1 slot answer
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter ask profile creation conf 2 slot
	  When user gives the profile creation conf 2 slot answer invalid
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter please answer 0 to 10
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter ask profile creation conf 2 slot
	  When user gives the profile creation conf 2 slot answer valid
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
	   And utter profile creation closing 1
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation closing 2
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation closing 3
	   And therapist produces a response
       And therapist response is found to be addressed to the user
	   And utter profile creation closing 4
	   And user participant code is in db
	   
	   