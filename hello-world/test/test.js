const process = require('process');
const oasis = require('@oasislabs/client');
const config = require('../config');
var assert = require('assert');

let bytecode = require('fs').readFileSync(config.WASM);
console.log(config);

const chains = {
  local: {
    gateway: new oasis.gateways.Web3Gateway(
      config.WEB3_GATEWAY_URL,
      oasis.Wallet.fromMnemonic(config.MNEMONIC)
    ),
    completion: chain => chain.gateway.disconnect(),
  },
  devnet: {
    gateway: new oasis.gateways.Gateway(
      config.DEVELOPER_GATEWAY_URL,
    ),
    completion: chain => {},
  }
};

if (process.env.CHAIN === undefined) {
  console.log("Please specify environment variable CHAIN={local, devnet}");
  process.exit();
}

let chain = chains[process.env.CHAIN];
if (chain === undefined) {
  console.log("The options for CHAIN are 'local' or 'devnet'");
  process.exit();
}

console.log(chain);

describe('Hello World Test', function () {
  it('deploy a non-confidential service', async () => {
    service = await oasis.deploy({
      bytecode,
      arguments: [],
      header: { confidential: false },
      gateway: chain.gateway,
    });
  });

  it('test known greeting', async () => {
    let greeting = await service.say_hello("sl");
    console.log("In slovenian: %s", greeting);
  });

  it('test unknown greeting', async () => {
    let greeting = await service.say_hello("ws");
    console.log("In Samoan: %s", greeting);
    assert(greeting == null);
  });

  it('insert new greeting in Samoan', async () => {
    await service.add_hello("ws", "alofa fiafia i le lalolagi!");
    let greeting = await service.say_hello("ws");
    console.log("In Samaon: %s", greeting);
    assert(greeting == "alofa fiafia i le lalolagi!");
    chain.completion(chain);
  });
});

