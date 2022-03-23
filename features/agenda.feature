Feature: Rasa Chat recommendations

  Scenario: Add activity planning to Niceday Agenda
     Given rasa bot is up and running
      When user is authenticated
      Then test user is connected
      When we ask for the agenda
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And advice on running distance is given
       And therapist produces a response
       And therapist response is found to be addressed to the user
       And rasa bot offers to add planning to niceday agenda
      When we respond yes
      Then the message is addressed to the therapist
      When therapist produces a response
      Then therapist response is found to be addressed to the user
       And rasa bot confirms it has added planning to niceday agenda


