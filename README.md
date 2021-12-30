# PerfectFit virtual coach system main repository
This is a virtual coach system that will coach users into being more physically active and stop smoking.

## Software development planning
See [software development planning document](https://nlesc.sharepoint.com/:w:/r/sites/team-flow/Shared%20Documents/PerfectFit/Perfect%20Fit%20-%20RFCs/PerfectFit-RFC-0007-software-development-planning.docx?d=w434661cbf10c458998e9e45ea6451ea4&csf=1&web=1&e=8cxoLW)

## Architecture design
Take a look at the design [here](docs/design.md).

## Setting up an account in the NiceDay alpha app
1. Download the NiceDay alpha version on your phone. 
2. Open the downloaded app and create a client account. 
This can be with the same credentials as for the normal NiceDay app.
3. Login to the downloaded app on your phone with the account you just created.
4. Send a connection request to the "PerfectFitTherapist Test"-therapist from the app.
5. Login to the therapist account on https://alpha.niceday.app/ and accept the connection request from the client.

## Setup
1. Create a file called `.env` in the root of this app.
Save the therapist user id and password in your `.env` file as THERAPIST_USER_ID and THERAPIST_PASSWORD, respectively.
See .env-example for a template.

## Run application
Run `script/server` script to serve the application, or follow these steps:
1. Build the images of each component. 
You can use `fetch_and_build_all_images.sh` to do this 
(currently only works for the main branch of the `virtual-coach-server` and `virtual-coach-db` repos).
2. Start everything with `docker compose up`.

## Test
Run `script/test` script to serve the application and run `behave`, or follow these steps:
1. Follow setup
2. Install dev requirements using `pip install -r requirements-dev.txt`
3. Once all containers are initialised and healthy, run the tests by typing `behave`
4. Alternatively, you can run the `scripts/test` script, which executes the above steps.
