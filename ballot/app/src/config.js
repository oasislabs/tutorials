/**
 * Constants that should be defined as environment variables if one wants to
 * run the tests against a custom gateway.
 */
const WEB3_GATEWAY_URL = 'ws://localhost:8546'; // TODO: Remove this
const DEVELOPER_GATEWAY_URL = 'http://localhost:1234'; // TODO: Replace this with production dev-gateway
const MNEMONIC = 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready'; // TODO: Remove this
const BYTECODE = '/assets/bytecode/ballot.wasm';
const BALLOT_ARGS = [
  'Which starter Pokemon is the best?',
  [
    'Bulbasaur',
    'Charmander',
    'Squirtle',
  ],
];

module.exports = {
  WEB3_GATEWAY_URL,
  DEVELOPER_GATEWAY_URL,
  MNEMONIC,
  BYTECODE,
  BALLOT_ARGS,
};
