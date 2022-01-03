#!/bin/bash
mkdir -p 'build'
cd 'build' || exit 1
BUILD_DIR=$(pwd)

# Fetch repos
git clone https://github.com/PerfectFit-project/virtual-coach-rasa.git
git clone https://github.com/PerfectFit-project/niceday-components.git
git clone https://github.com/PerfectFit-project/virtual-coach-db.git

cd ./virtual-coach-rasa/ || exit 1
git pull

RASA_DIR=$(pwd)
# Build Rasa server image
cd Rasa_Bot/ || exit 1
docker build . -t rasa-server || exit 1

# Build Rasa actions image
cd actions/ || exit 1
docker build . -t rasa-actions || exit 1

# Build Scheduler image
cd $RASA_DIR/scheduler/ || exit 1
docker build . -t scheduler || exit 1

cd $BUILD_DIR || exit 1

cd ./niceday-components || exit 1
git pull

# Build niceday-broker image
cd niceday-broker/ || exit 1
./script/bootstrap
docker build . -t niceday-broker || exit 1
cd ..

# Build niceday-api image
cd niceday-api/ || exit 1
./script/bootstrap
docker build . -t niceday-api || exit 1
cd $BUILD_DIR || exit 1


# Build database management image
cd ./virtual-coach-db || exit 1
git pull
docker build . -t manage-db || exit 1
cd $BUILD_DIR || exit 1
