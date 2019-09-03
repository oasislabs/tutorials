# Build service
FROM oasislabs/rust

RUN mkdir /service
COPY ./ballot/service /service
WORKDIR /service

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -qq install \
    curl \
    python3
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly && \
    . /root/.cargo/env && \
    rustup component add rustfmt && \
    rustup target add wasm32-wasi wasm32-unknown-unknown && \
    echo "source ~/.cargo/env" >> ~/.bashrc
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
