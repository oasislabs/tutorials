/**
 * Constants that should be defined as environment variables if one wants to
 * run the tests against a custom gateway.
 */
const WEB3_GATEWAY_URL = 'ws://localhost:8546';
const DEVELOPER_GATEWAY_URL = 'http://localhost:1234';
const MNEMONIC = 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready';
const WASM = './target/service/hello-world.wasm';

module.exports = {
  WEB3_GATEWAY_URL,
  DEVELOPER_GATEWAY_URL,
  MNEMONIC,
  WASM
}
