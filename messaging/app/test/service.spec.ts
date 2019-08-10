import oasis from '@oasislabs/client';

const ethers = require('ethers');

jest.setTimeout(20000);

describe('MessageBoard Test', () => {
  let service;
  let zurix, variusFlavus, vitalstatistix;

  beforeAll(async () => {
    zurix =
      Array.from(oasis.utils.bytes.parseHex(
        ethers.Wallet.fromMnemonic("range drive remove bleak mule satisfy mandate east lion minimum unfold ready",
        "m/44'/60'/0'/0/0").address));
    variusFlavus =
      Array.from(oasis.utils.bytes.parseHex(
        ethers.Wallet.fromMnemonic("range drive remove bleak mule satisfy mandate east lion minimum unfold ready",
         "m/44'/60'/0'/0/1").address));
    vitalstatistix =
      Array.from(oasis.utils.bytes.parseHex(
        ethers.Wallet.fromMnemonic("range drive remove bleak mule satisfy mandate east lion minimum unfold ready",
        "m/44'/60'/0'/0/2").address));

    service = await oasis.workspace.MessageBoard.deploy(80, {
      header: {confidential: true},
      options: { gasLimit: '0xf42400' },
      from: zurix,
    });
  });

  it('deployed', async () => {
    expect(service).toBeTruthy();
  });

  it('variusFlavus cannot post anything', async() => {
    try {
      await service.post('All your sestertii belong to me!', {
        from: variusFlavus,
      });
    } catch (e) {
      console.log("Result = %s", e);
    }
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
