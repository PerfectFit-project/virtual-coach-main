Feature: Test

  Scenario: Test
     Given rasa bot is up and running
       And the connection to the database is successful
      When user is authenticated
      Then the words are stored in the DB


