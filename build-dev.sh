#!/bin/sh

# This supposedly speeds up npm install
npm set progress=false

# Remove old build artifacts. 
# Doing manual cleanup here instead of blowing away the entire workspace due to how long it takes to reinstall npm dependencies.
rm -rf build css fonts js images index.html favicon.ico XDomainReceiver.html

# Install dependencies
npm prune
npm install
npm run build-dev

# Upload sourcemap files to Sentry
sentry-cli releases -o the-social-edge -p contempo-dev new $APP_VERSION --ref $GIT_COMMIT
sentry-cli releases -o the-social-edge -p contempo-dev files $APP_VERSION upload-sourcemaps build/assets/

# Delete the sourcemap file after uploading to Sentry, we don't want to publish it to S3
rm build/assets/*.map

# Copy the build results to the root to prepare for S3 publish
cp -rf build/* .

# Remove everything from the S3 bucket
aws s3 rm --recursive s3://tse-contempo-dev
