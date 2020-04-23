import { Gateway } from 'oasis-std';

import { HelloWorld } from '../service-clients/hello-world';

async function main() {
    const gw: Gateway = new Gateway(
        'https://gateway.devnet.oasiscloud.io',
        'AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa',
    );

    const service = await HelloWorld.deploy(gw);
    console.log(
        `Deployed ${service.constructor.name} at ${service.address.hex}`,
    );
}

main().catch(console.error);
