import { Gateway } from 'oasis-std';

import { DiceGame } from '../service-clients/dice-game';

jest.setTimeout(15000);

describe('DiceGame', () => {
    let service: DiceGame;

    const gw: Gateway = new Gateway(
        'http://localhost:1234',
        'AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa',
    );

    beforeAll(async () => {
        service = await DiceGame.deploy(gw, { numPlayers: 2 });
    });

    it('deployed', async () => {
        expect(service).toBeTruthy();
    });

    it('start dice game', async () => {
        let inPlay = await service.isInPlay();
        expect(inPlay).toEqual(true);

        // players
        let playerOne = 'stan';
        let playerTwo = 'nick';

        let score1 = await service.roll({ pName: playerOne });
        let score2 = await service.roll({ pName: playerTwo });

        inPlay = await service.isInPlay();
        expect(inPlay).toEqual(false);

        let winner = await service.winner();
        if (score1 > score2) {
            console.log('SCORE 1 BIGGER');
            expect([playerOne]).toEqual(winner);
        } else if (score1 < score2) {
            console.log('SCORE 2 BIGGER');
            expect([playerTwo]).toEqual(winner);
        } else {
            console.log('SCORE 3 BIGGER');
            expect([playerOne, playerTwo]).toEqual(winner);
        }
    });

    afterAll(async () => {
        await gw.disconnect();
    });
});
