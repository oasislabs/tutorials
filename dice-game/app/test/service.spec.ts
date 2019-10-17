import oasis from '@oasislabs/client';

jest.setTimeout(20000);

describe('DiceGame', () => {
  let service;

  beforeAll(async () => {
    service = await oasis.workspace.DiceGame.deploy(2, {
      header: {confidential: false},
      gasLimit: '0xe79732',
    });
  });

  it('deployed', async () => {
    expect(service).toBeTruthy();
  });

  it('start dice game', async() => {
    let inPlay = await service.isInPlay();
    expect(inPlay).toEqual(true);

    // players
    let playerOne =  "stan";
    let playerTwo =  "nick";

    let score1 = await service.roll(playerOne);
    let score2 = await service.roll(playerTwo);

    inPlay = await service.isInPlay();
    expect(inPlay).toEqual(false);

    let winner = await service.winner();
    if (score1 > score2) {
      expect([playerOne]).toEqual(winner);
    } else if (score1 < score2) {
      expect([playerTwo]).toEqual(winner);
    } else {
      expect([playerOne, playerTwo]).toEqual(winner);
    }
  })

  afterAll(() => {
    oasis.disconnect();
  });
});
