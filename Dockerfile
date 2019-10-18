FROM oasislabs/rust

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly-2019-08-26 && \
    . /root/.cargo/env && \
    rustup component add rustfmt clippy && \
    rustup target add wasm32-wasi wasm32-unknown-unknown

RUN curl --proto '=https' --tlsv1.2 -sSL https://get.oasis.dev | python3

VOLUME /tutorials
