# pylint: disable=function-redefined

from behave import given, when, then
import requests

RASA_URL = 'http://localhost:5005'
DB_URL = 'http://localhost:5432'
EXPECTED_RUNNING_DISTANCE_RESPONSE = 'you should run 40.0 kilometers this week'
EXPECTED_PLANNING_OFFERS = ['Zal ik de planning in je NiceDay agenda zetten?',
                            'Wil je dat ik de planning in je NiceDay agenda zet?']


@given('rasa bot is up and running')
def step_impl(context):
    r = requests.get(RASA_URL)
    assert r.status_code == 200
    r.raise_for_status()


@when('we ask for the agenda')
def step_impl(context):
    webhookurl = RASA_URL + '/webhooks/rest/webhook'

    body = {
        "message": "Kan ik de agenda voor de week krijgen?",
        "sender": "user"}

    r = requests.post(webhookurl, json=body)
    r.raise_for_status()

    assert r.status_code == 200

    context.chat_responses = r.json()


@when('we respond yes')
def step_impl(context):
    webhookurl = RASA_URL + '/webhooks/rest/webhook'

    body = {
        "message": "Ja",
        "sender": "user"}

    r = requests.post(webhookurl, json=body)
    r.raise_for_status()

    assert r.status_code == 200

    context.chat_responses = r.json()


@then('all messages are found to be addressed to the user')
def step_impl(context):
    for msg in context.chat_responses:
        assert 'recipient_id' in msg
        assert msg['recipient_id'] == 'user'


@then('advice on running distance is given')
def step_impl(context):
    for msg in context.chat_responses:
        assert 'text' in msg
        if EXPECTED_RUNNING_DISTANCE_RESPONSE in msg['text']:
            break
    else:
        assert False


@then('rasa bot offers to add planning to niceday agenda')
def step_impl(context):
    assert hasattr(context, 'chat_responses')
    assert len(context.chat_responses) != 0
    assert 'text' in context.chat_responses[-1]
    for expected_planning_offer in EXPECTED_PLANNING_OFFERS:
        if expected_planning_offer in context.chat_responses[-1]['text']:
            break
    else:
        assert False


@then('rasa bot confirms it has added planning to niceday agenda')
def step_impl(context):
    for msg in context.chat_responses:
        assert 'text' in msg
        if 'Cool' in msg['text'] or 'Okay' in msg['text']:
            break
    else:
        assert False
