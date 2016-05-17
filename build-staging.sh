#!/bin/sh

# This supposedly speeds up npm install
npm set progress=false

# Remove old build artifacts. 
# Doing manual cleanup here instead of blowing away the entire workspace due to how long it takes to reinstall npm dependencies.
rm -rf build css fonts js images index.html favicon.ico XDomainReceiver.html

# build old stuff first
cd quarantine

# Install dependencies
npm prune
npm install
bower install
gulp build --env=staging

# then build new stuff
cd ..

# Install dependencies
npm prune
npm install
bower install
gulp build --staging

# Copy the build results to the root to prepare for S3 publish
cp -rf build/* .

# Remove everything from the S3 bucket
aws s3 rm --recursive s3://tse-contempo-test
