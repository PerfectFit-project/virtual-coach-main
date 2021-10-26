# End to end testing repository

Contains end to end tests for full virtual coach setup.


## Setup
1. Create a file called `.env` in the root of this app. Save the therapist user id and password in your `.env` file as THERAPIST_USER_ID and THERAPIST_PASSWORD, respectively.
See .env-example for a template.
2. Install `behave` using `pip install behave`


## Usage

1. Build the images of each component. You can use `fetch_and_build_all_images.sh` to do this (currently only works for the main branch of the `virtual-coach-server` and `virtual-coach-db` repos.

2. Start everything with `docker compose up`.

3. Once all containers are initialised and healthy, run the tests by typing `behave`

Alternatively, you can run the `run_e2e.sh` script, which executes the above steps.
