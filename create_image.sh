#!/bin/bash

npm install
npm run ng build --prod

version=dev

docker build --rm --build-arg app_version_arg=dev -f Dockerfile -t binarysearch/galaxyvictor:$version .

docker push binarysearch/galaxyvictor:$version
