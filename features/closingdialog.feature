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
       And utter greeting is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratulate_1 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratulate_2 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratulate_3 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratulate_4 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratulate_5 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_congratulate_6 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_pa_1 is printed
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
       And utter_closing_pa_8 is printed.
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_smoke_1 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_ask_closing_lapse_info_correct is printed
      When user answers utter_closing_smoke_1 with 1 is printed
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And utter_closing_smoke_succes_1 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_smoke_succes_2 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_smoke_succes_3 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_smoke_succes_4 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_smoke_succes_5 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_smoke_succes_6 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_smoke_succes_7 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_smoke_succes_8 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_ask_closing_reflection_smoke_done is printed
      When user answers utter_ask_closing_reflection_smoke_done with klaar
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_1 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_2 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_3 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_4 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_ask_closing_relapse_prevention_plan_one_done is printed
      When user answers utter_ask_closing_relapse_prevention_plan_one_done with klaar
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_5 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist sends an image
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_6 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_7 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And therapist sends an image
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_8a is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_8b is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_9a is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_9b is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_10 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_11 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_12 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_13 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_14 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_15 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_15 is printed
      When user answers utter_ask_closing_relapse_prevention_plan_two_done with klaar
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And utter_closing_prevention_plan_16 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_success_1 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_success_2 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_success_3 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_success_4 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_success_5 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_prevention_success_6 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_closing_1 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_closing_2 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_closing_3 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_closing_4 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_closing_5 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_ask_closing_pf_grade is printed
      When user answers utter_ask_closing_pf_grade with 7
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And dankjewel is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_ask_closing_pf_evaluate is printed is printed
      When user answers utter_ask_closing_pf_evaluate with text
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And utter_closing_closing_6 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_closing_7 is printed
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And utter_closing_closing_8 is printed