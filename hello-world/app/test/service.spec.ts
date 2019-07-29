import oasis from '@oasislabs/client';

jest.setTimeout(20000);

describe('HelloWorld Test', () => {
  it('should deploy non-confidentially', async () => {
    const service = await oasis.workspace.HelloWorld.deploy({
      header: {confidential: false},
    });

    expect(service).toBeTruthy();
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
