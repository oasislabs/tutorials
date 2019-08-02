import oasis from '@oasislabs/client';

jest.setTimeout(20000);

describe('HelloWorld Test', () => {
  let service;

  beforeAll(async () => {
    // Wallet private key.
    const privateKey = '<your private key>';

    // Wallet for signing and paying for transactions.
    const wallet = new oasis.Wallet(privateKey);

    // Etheruem gateway responsible for signing transactions.
    const gateway = new oasis.gateways.Web3Gateway('wss://web3.devnet.oasiscloud-staging.net/ws', wallet);

    // Configure the gateway to use.
    oasis.setGateway(gateway);

    // Deploy the service
    service = await oasis.workspace.HelloWorld.deploy({
      header: {confidential: false},
    });
  });

  it('deployed', async () => {
    expect(service).toBeTruthy();
  });

  it('known greeting', async () => {
    let greeting = await service.say_hello('sl');
    expect(greeting).toEqual('Pozdravljen, svet!');
  });

  it('insert new greeting in Samoan', async () => {
    let greeting = await service.say_hello('ws');
    expect(greeting).toBeNull();
    await service.add_hello('ws', 'alofa fiafia i le lalolagi!');
    greeting = await service.say_hello('ws');
    expect(greeting).toEqual('alofa fiafia i le lalolagi!');
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
