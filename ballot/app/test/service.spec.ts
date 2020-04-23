import {Ballot} from '../service-clients/ballot';

import {Gateway} from 'oasis-std';

jest.setTimeout(20000);

describe('Ballot', () => {
  let service: Ballot;

  const gw: Gateway = new Gateway(
    'http://localhost:1234',
    'AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa',
  );

  beforeAll(async () => {
    service = await Ballot.deploy(gw, {
      description: 'Secret Ballot',
      candidates: ['Alice', 'Bob'],
    });
  });

  it('deployed', () => {
    expect(service).toBeTruthy();
  });

  afterAll(async () => {
    await gw.disconnect();
  });
});
