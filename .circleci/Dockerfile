# Build service
FROM oasislabs/rust

RUN mkdir /service
COPY ./ballot/service /service
WORKDIR /service

RUN oasis build

# Build application
FROM node:lts-alpine

COPY ballot/app/package*.json /app
WORKDIR /app

RUN npm install
COPY ballot/app /app
RUN mkdir -p /app/public/assets/bytecode
COPY /service/target/service/ballot.wasm /app/public/assets/bytecode

RUN npm run build
COPY /app/dist /app/static/staging
