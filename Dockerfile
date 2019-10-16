FROM ubuntu:18.04

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -qq install \
    curl \
    git \
    build-essential \
    libssl-dev \
    pkg-config \
    python \
    python3 \
    python3-pip

RUN pip3 install boto3 pylint yapf pytest pytest-xdist

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly-2019-08-26 && \
    . /root/.cargo/env && \
    rustup component add rustfmt clippy && \
    rustup target add wasm32-wasi wasm32-unknown-unknown

RUN curl -sSLf https://github.com/CraneStation/wasi-sdk/releases/download/wasi-sdk-6/wasi-sdk_6.0_amd64.deb -o wasi-sdk_6.0_amd64.deb && \
    dpkg -i wasi-sdk_6.0_amd64.deb

RUN curl --proto '=https' --tlsv1.2 -sSL https://get.oasis.dev | python && \
    sed -i 's/mesg n || true/tty -s \&\& mesg n || true/' /root/.profile && \
    /bin/bash -c 'source /root/.profile'

RUN git clone https://github.com/oasislabs/tutorials.git
