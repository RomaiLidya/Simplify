#!/usr/bin/env bash

WORKDIR=/home/ec2-user/workspace/simplify

# Change CWD
cd ${WORKDIR}

$(aws ecr get-login --no-include-email --region ap-southeast-1)
docker build -f deploy/api/App.Dockerfile -t simplify .

# Tagging the image
docker tag simplify 801125502627.dkr.ecr.ap-southeast-1.amazonaws.com/simplify

sleep 10

# Pushing the image
docker push 801125502627.dkr.ecr.ap-southeast-1.amazonaws.com/simplify

# cleaning the image
docker image prune -f
