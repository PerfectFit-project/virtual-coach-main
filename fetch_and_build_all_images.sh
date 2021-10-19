TEST_DIR='_test_dir'

mkdir -p $TEST_DIR
cd $TEST_DIR || exit 1

# Fetch repos
git clone https://github.com/PerfectFit-project/virtual-coach-server.git
git clone https://github.com/PerfectFit-project/virtual-coach-db.git

cd virtual-coach-server/ || exit 1
git pull

# Build Rasa server image
cd Rasa_Bot/ || exit 1
docker build . -t e2e-rasa-server || exit 1
cd ..

# Build Rasa actions image
cd Rasa_Bot/actions || exit 1
docker build . -t e2e-rasa-actions || exit 1
cd ../..

# Build niceday-broker image
cd niceday-broker/ || exit 1
./script/bootstrap
docker build . -t e2e-niceday-broker || exit 1
cd ..

# Build niceday-api image
cd niceday-api/ || exit 1
./script/bootstrap
docker build . -t e2e-niceday-api || exit 1
cd ..

# Build database management image
cd ../virtual-coach-db/ || exit 1
git pull
docker build . -t e2e-manage-db || exit 1
cd ..
