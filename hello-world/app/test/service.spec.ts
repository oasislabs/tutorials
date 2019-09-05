import oasis from '@oasislabs/client';

jest.setTimeout(20000);

describe('HelloWorld Test', () => {
  let service;

  beforeAll(async () => {
    service = await oasis.workspace.HelloWorld.deploy({
      header: {confidential: false},
    });
  });

  it('deployed', async () => {
    expect(service).toBeTruthy();
  });

  it('known greeting', async () => {
    let greeting = await service.sayHello('sl');
    expect(greeting).toEqual('Pozdravljen, svet!');
  });

  it('insert new greeting in Samoan', async () => {
    let greeting = await service.sayHello('ws');
    expect(greeting).toBeNull();
    await service.addHello('ws', 'alofa fiafia i le lalolagi!');
    greeting = await service.sayHello('ws');
    expect(greeting).toEqual('alofa fiafia i le lalolagi!');
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
