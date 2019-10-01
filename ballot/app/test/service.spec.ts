const oasis = require('@oasislabs/client');

jest.setTimeout(20000);

describe('Ballot Test', () => {
  let ballot;

  beforeAll(async () => {
    // Deploy your ballot service!
    ballot = await oasis.workspace.Ballot.deploy('What\'s for dinner', ['beef', 'yogurt'], {
      header: {confidential: false},
      gasLimit: '0xf42400',
    });
  });

  it('deployed', async () => {
    expect(ballot).toBeTruthy();
  });

  it('test getters', async () => {
    // Get description
    const description = await ballot.description();
    expect(description).toEqual('What\'s for dinner');

    // Get candidates' list
    const candidates = await ballot.candidates();
    expect(candidates).toEqual(['beef', 'yogurt']);

    // Check if voting is open (it should be)
    const votingOpen = await ballot.votingOpen();
    expect(votingOpen).toEqual(true);
  });

  it('test voting mechanics', async () => {
    // Check that you can vote without issue
    await ballot.vote(0);
    await ballot.close();
  });

  it('test results', async () => {
    // Check if voting is open (it shouldn't be)
    const votingOpen = await ballot.votingOpen();
    expect(votingOpen).toEqual(false);

    // Ensure winner is the candidate with the most votes
    const winner = await ballot.winner();
    expect(winner).toEqual(0);

    // Check full list of results is as expected
    const results = await ballot.results();
    expect(results).toEqual([1, 0]);
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
