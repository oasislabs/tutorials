# Build service
FROM oasislabs/rust

RUN mkdir /service
COPY ballot/service /service
WORKDIR /service

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -qq install \
    curl \
    python
RUN curl --proto '=https' --tlsv1.2 -sSL https://get.oasis.dev | python
RUN export PATH=$PATH:$HOME/.local/bin \
RUN oasis build

# Build application
FROM node:lts-alpine

RUN mkdir /app
COPY ballot/app/package*.json /app/
WORKDIR /app

RUN npm install
COPY ballot/app /app
COPY ballot/service/target/service/ballot.wasm /app/public/assets

RUN npm run build
RUN mkdir /app/static
RUN mv /app/dist /app/static/staging
