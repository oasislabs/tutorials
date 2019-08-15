import oasis from '@oasislabs/client';

jest.setTimeout(20000);

describe('Ballot', () => {
  let service;

  beforeAll(async () => {
    service = await oasis.workspace.Ballot.deploy({
      header: {confidential: false},
    });
  });

  it('deployed', async () => {
    expect(service).toBeTruthy();
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
