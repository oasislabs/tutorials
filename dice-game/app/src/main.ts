import { Gateway } from 'oasis-std';

import { DiceGame } from '../service-clients/dice-game';

async function main() {
    const gw: Gateway = new Gateway(
        'https://gateway.devnet.oasiscloud.io',
        'AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa',
    );

    const service = await DiceGame.deploy(gw, { numPlayers: 3 });
    console.log(
        `Deployed ${service.constructor.name} at ${service.address.hex}`,
    );
}

main().catch(console.error);
