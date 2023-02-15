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
       And first aid kit intro is printed
	  When therapist produces a response
      Then therapist response is found to be addressed to the user
       And first aid kit content is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And first aid kit show activity titles two is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And first aid kit chosen activity slot intro is printed
      When user gives the chosen activity slot
      Then the message is addressed to the therapist
      When therapist produces a response
       Then therapist response is found to be addressed to the user
       And first aid kit show full text noinput one is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And first aid kit show full text noinput two is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And first aid kit end or repeat is printed
	  When user gives the first aid kit end slot
      Then the message is addressed to the therapist
      When therapist produces a response
       Then therapist response is found to be addressed to the user
	   And first aid kit end one is printed
	   And therapist produces a response
       And therapist response is found to be addressed to the user
       And first aid kit end two is printed