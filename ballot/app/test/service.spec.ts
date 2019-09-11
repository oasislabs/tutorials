import oasis from '@oasislabs/client';

jest.setTimeout(20000);

describe('Ballot', () => {
  let service;

  beforeAll(async () => {
    service = await oasis.workspace.Ballot.deploy('Secret Ballot', ['Alice', 'Bob'], {
      header: { confidential: false },
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
