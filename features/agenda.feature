Feature: Rasa Chat recommendations

  Scenario: Get user km run target
     Given rasa bot is up and running
      When we ask for the agenda
      Then all messages are found to be addressed to the user
       And advice on running distance is given

  Scenario: Add activity planning to Niceday Agenda
     Given rasa bot is up and running
      When we ask for the agenda
      Then rasa bot offers to add planning to niceday agenda
      When we respond yes
      Then rasa bot confirms it has added planning to niceday agenda


