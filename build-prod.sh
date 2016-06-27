#!/bin/sh

# This supposedly speeds up npm install
npm set progress=false

# Remove old build artifacts. 
# Doing manual cleanup here instead of blowing away the entire workspace due to how long it takes to reinstall npm dependencies.
rm -rf build css fonts js images index.html favicon.ico XDomainReceiver.html

# Install dependencies
npm prune
npm install
bower install
gulp build --production

# Copy the build results to the root to prepare for S3 publish
cp -rf build/* .

# Remove everything from the S3 bucket
aws s3 rm --recursive s3://tse-contempo-prod
