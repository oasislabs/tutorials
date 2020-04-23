import { Gateway } from 'oasis-std';

import {
    RockPaperScissors,
    Move,
} from '../service-clients/rock-paper-scissors';

jest.setTimeout(15000);

describe('RockPaperScissors', () => {
    let service: RockPaperScissors;

    const gw: Gateway = new Gateway(
        'http://localhost:1234',
        'AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa',
    );

    beforeAll(async () => {
        service = await RockPaperScissors.deploy(gw);
    });

    it('deployed', async () => {
        expect(service).toBeTruthy();
    });

    it('play game', async () => {
        const canplay = await service.canPlay();
        expect(canplay).toEqual(true);

        const player1 = await service.play({
            pName: 'stan',
            pMove: new Move.Paper(),
        });
        expect(player1).toEqual('Player stan has played.');

        const player2 = await service.challenge({
            cName: 'nick',
            cMove: new Move.Paper(),
        });
        expect(player2).toEqual(
            "Both players have played. Use reveal() to see what both players' moves were.",
        );

        const canplay2 = await service.canPlay();
        expect(canplay2).toEqual(false);

        const score = await service.reveal();
        expect(score).toEqual('stan played Paper and nick played Paper. Tie!');
    });

    afterAll(async () => {
        await gw.disconnect();
    });
});
