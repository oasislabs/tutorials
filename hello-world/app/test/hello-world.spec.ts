import { Gateway } from 'oasis-std';

import { HelloWorld } from '../service-clients/hello-world';

jest.setTimeout(5000);

describe('HelloWorld', () => {
    let service: HelloWorld;

    // create a gateway to the oasis node
    const gw: Gateway = new Gateway(
        'http://localhost:1234',
        'AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa',
    );

    beforeAll(async () => {
        service = await HelloWorld.deploy(gw);
    });

    it('deployed', () => {
        expect(service.address.bytes).toHaveLength(20);
    });

    it('known greeting', async () => {
        let greeting = await service.sayHello({ language: 'ws' });
        expect(greeting).toBeUndefined();

        await service.addHello({
            language: 'ws',
            helloWorld: 'alofa fiafia i le lalolagi!',
        });
        greeting = await service.sayHello({ language: 'ws' });
        expect(greeting).toEqual('alofa fiafia i le lalolagi!');
    });

    afterAll(async () => {
        await gw.disconnect();
    });
});
