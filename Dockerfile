# Build service
FROM oasislabs/rust

RUN mkdir /service
COPY ballot/service /service
WORKDIR /service

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -qq install \
    curl \
    git \
    build-essential \
    libssl-dev \
    pkg-config \
    python \
    python3-pip

RUN pip3 install boto3 pylint yapf pytest pytest-xdist

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly-2019-08-26 && \
    . /root/.cargo/env && \
    rustup component add rustfmt && \
    rustup target add wasm32-wasi wasm32-unknown-unknown && \
    echo "source ~/.cargo/env" >> ~/.bashrc

RUN curl --proto '=https' --tlsv1.2 -sSL https://get.oasis.dev | python && \
    export PATH=$PATH:~/.local/bin && \
    oasis build

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
