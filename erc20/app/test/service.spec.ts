import oasis from '@oasislabs/client';

const ethers = require('ethers');

jest.setTimeout(20000);

describe('ERC20 Test', () => {
  let service;
  let zurix, variusFlavus, vitalstatistix;

  beforeAll(async () => {
    zurix =
      oasis.utils.bytes.parseHex(
        ethers.Wallet.fromMnemonic("range drive remove bleak mule satisfy mandate east lion minimum unfold ready",
        "m/44'/60'/0'/0/0").address);
    variusFlavus =
      oasis.utils.bytes.parseHex(
        ethers.Wallet.fromMnemonic("range drive remove bleak mule satisfy mandate east lion minimum unfold ready",
         "m/44'/60'/0'/0/1").address);
    vitalstatistix =
      oasis.utils.bytes.parseHex(
        ethers.Wallet.fromMnemonic("range drive remove bleak mule satisfy mandate east lion minimum unfold ready",
        "m/44'/60'/0'/0/2").address);

    console.log("zurix = %s, variusFlavus = %s, vitalstatistix = %s", zurix, variusFlavus, vitalstatistix);

    service = await oasis.workspace.ERC20Token.deploy(1000, {
      header: {confidential: false},
      options: { gasLimit: '0xf42400' },
      from: zurix,
    });
  });

  it('deployed', async () => {
    expect(service).toBeTruthy();
  });

  it('transfer from bank to the governor of Condatum', async () => {
    try {
      await service.transfer(variusFlavus, 500);
    } catch (e) {
      console.log(e);
    }

    // check the governor's balance
    const balance = await service.balance_of(variusFlavus);
    console.log("VariusFlavus is now in possession of %d tokens", balance);
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
