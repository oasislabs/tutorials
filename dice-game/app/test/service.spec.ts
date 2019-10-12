import oasis from '@oasislabs/client';

jest.setTimeout(20000);

describe('DiceGame', () => {
  let service;

  beforeAll(async () => {
    service = await oasis.workspace.DiceGame.deploy(5, {
      header: {confidential: false},
      gasLimit: '0xe79732',
    });
  });

  it('deployed', async () => {
    expect(service).toBeTruthy();
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
