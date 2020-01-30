FROM node:10-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install gyp and other dependencies
RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*

# Copy all the required file for transpiling to js
COPY ./api/package.json ./api/yarn.lock ./api/tsconfig.json ./api/.eslintrc.json ./api/.eslintignore ./api/.prettierrc ./

# Install node dependencies - done in a separate step so Docker can cache it
RUN yarn --no-optional --frozen-lockfile

# Copy the source files over for transpiling to js
COPY ./api/src ./src/

RUN yarn build

################### Start of main image building
FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install tzdata for timezone
RUN apk add --no-cache tzdata

# Copy all the required file for transpiling to js
COPY ./api/package.json ./api/yarn.lock ./

# Install gyp and other dependencies
RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*

# Install node dependencies - done in a separate step so Docker can cache it
RUN yarn --production --no-optional --frozen-lockfile

COPY ./deploy/api/.env.prd ./.env

COPY --from=builder /usr/src/app/build ./build/

EXPOSE 5000

CMD ["yarn", "start:prod"]
