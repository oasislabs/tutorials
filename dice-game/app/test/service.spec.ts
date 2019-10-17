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

    let score1 = await service.roll(playerOne,  {
      gasLimit: '0xe79732',
    });
    let score2 = await service.roll(playerTwo,  {
      gasLimit: '0xe79732',
    });

    inPlay = await service.isInPlay();
    expect(inPlay).toEqual(false);

    let winner = await service.winner();
    if (score1 > score2) {
      console.log("SCORE 1 BIGGER");
      expect([playerOne]).toEqual(winner);
    } else if (score1 < score2) {
      console.log("SCORE 2 BIGGER");
      expect([playerTwo]).toEqual(winner);
    } else {
      console.log("SCORE 3 BIGGER");
      expect([playerOne, playerTwo]).toEqual(winner);
    }
  })

  afterAll(() => {
    oasis.disconnect();
  });
});
