# End to end testing repository

Contains end to end tests for full virtual coach setup.

## Usage

1. Build the images of each component. You can use `fetch_and_build_all_images.sh` to do this (currently only works for the main branch of the `virtual-coach-server` and `virtual-coach-db` repos.

2. Start everything with `docker compose up`.

3. Once all containers are initialised and healthy, run the tests by typing `behave`
