# PerfectFit virtual coach system main repository
This is a virtual coach system that will coach users into being more physically active and stop smoking.
This is the main repository for running the full application.
Individual components of the app are in separate repositories:
- [virtual-coach-rasa](https://github.com/PerfectFit-project/virtual-coach-rasa) 
Contains code for rasa bot, the core of the virtual coach system.
Also includes `scheduler`, and `onboarding`
- [niceday-components](https://github.com/PerfectFit-project/niceday-components)
Components for interfacing the virtual-coach with the niceday app and sensehealth server.
- [niceday_client](https://github.com/PerfectFit-project/niceday_client)
Python package for interacting with the niceday-api component of the PerfectFit virtual coach.
- [virtual-coach-db](https://github.com/PerfectFit-project/virtual-coach-db)
Code around database for virtual coach system

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
1. Run `script/bootstrap` script
2. Start everything with `docker compose up`.

## Test
Run `script/test` script to serve the application and run `behave`, or follow these steps:
1. Run `script/bootstrap` script
2. Install dev requirements using `pip install -r requirements-dev.txt`
3. Start everything with `docker compose up`.
4. Once all containers are initialised and healthy, run the tests by typing `behave`

## For developers
By default this setup use the main branch for each component. 
As a developer you often want to use a different branch, or a local clone of the repository.

### Using a local clone docker image:
If you want to use a local clone, we suggest the following steps. 
We use the `virtual-coach-db` repository as an example.
1. Build a docker image based on your local repository. 
`cd` into your local `virtual-coach-db` repository, 
then do `docker build . -t virtual-coach-db-local`.
2. In `docker-compose.yml` replace `build: https://github.com/PerfectFit-project/virtual-coach-db.git#main` 
with `image: virtual-coach-db-local`. 
Note that the name of the image should correspond with the tag that you gave to it in the previous step

NB: Don't commit changes to `docker-compose.yml`

### Pointing to a different branch:
Alternatively you can point `docker-compose` to a different branch:
In `docker-compose.yml` replace `build: https://github.com/PerfectFit-project/virtual-coach-db.git#main` 
with `build: https://github.com/PerfectFit-project/virtual-coach-db.git#feature-branch`.

NB: Don't commit changes to `docker-compose.yml`

### Database
Test data is automatically loaded into the database using a script in 
`virtual-coach-db` [helper/populate_db.py](https://github.com/PerfectFit-project/virtual-coach-db/blob/ca6b5c79064c3b1dcf34ce83d1f59773f33427e3/helper/populate_db.py).
So if you want to test with different data you have to update this.
Or spin up the database and manipulate the data in the running database.

NB: The database is saved automatically by docker. To empty the volume that stores the database do:
```
docker compose down --volumes
```
Next time you run the application the database will be reinitialized.