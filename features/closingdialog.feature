Feature: Closing dialog

  Scenario: Closing dialog
     Given rasa bot is up and running
       And the connection to the database is successful
      When user is authenticated
      Then test user is connected
       And the conversation is restarted
      When we ask for the closing dialog
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And CHECK IF SLOT IS SET
       And utter greeting is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratualate_1 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratualate_2 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratualate_3 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratualate_4 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratualate_5 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratualate_6 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_pa_1 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And action_closing_get_total_number_steps is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_pa_2 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_pa_3 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_pa_4 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_pa_5 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_ask_closing_pa_evaluation is printed
      When user answers utter_ask_closing_pa_evaluation with 1
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And utter_closing_pa_6 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_pa_7 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_pa_8 is printed
