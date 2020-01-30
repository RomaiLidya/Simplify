FROM node:10-alpine

ARG S3_BUCKET

WORKDIR /usr/src/app

# Install aws-cli
RUN apk -Uuv add groff less python py-pip
RUN pip install awscli
RUN apk --purge -v del py-pip
RUN rm /var/cache/apk/*

COPY ./client/package.json ./client/yarn.lock ./

# Install node dependencies - done in a separate step so Docker can cache it
RUN yarn --no-optional --frozen-lockfile

COPY ./deploy/client/.env.prd ./.env

COPY ./client ./

RUN yarn build

RUN aws s3 sync build ${S3_BUCKET}


