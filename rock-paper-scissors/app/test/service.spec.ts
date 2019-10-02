import oasis from '@oasislabs/client';

jest.setTimeout(20000);

describe('RockPaperScissors', () => {
  let service;

  beforeAll(async () => {
    service = await oasis.workspace.RockPaperScissors.deploy({
      header: {confidential: false},
    });
  });

  it('deployed', async () => {
    expect(service).toBeTruthy();
  });

  it('play game', async() => {
    let canplay = await service.canPlay();
    expect(canplay).toEqual(true);
    let player1 = await service.play("stan", 3);
    console.log(player1);
    expect(player1).toEqual('Player stan has played.');


    let player2 = await service.challenge("nick", 3);
    console.log(player2);
    expect(player2).toEqual("Both players have played. Use reveal() to see what both players' moves were.");

    let canplay2 = await service.canPlay();
    expect(canplay2).toEqual(false);
    let score = await service.reveal();
    console.log(score);
    expect(score).toEqual('stan played Scissors and nick played Scissors. Tie!');
  })


  afterAll(() => {
    oasis.disconnect();
  });
});
