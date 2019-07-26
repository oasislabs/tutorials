const oasis = require('@oasislabs/client');

describe('HelloWorld Test', () => {
  it('should deploy non-confidentially', async () => {
    const service = await oasis.project.HelloWorldClient.deploy({
      confidential: false,
    });

    expect(service).toBeTruthy();
  });

  it('test known greeting', async () => {
    let greeting = await service.say_hello("sl");
    console.log("In slovenian: %s", greeting);

    expect(greeting).toEqual("Pozdravljen, svet!");
  });

  it('test unknown greeting', async () => {
    let greeting = await service.say_hello("ws");
    console.log("In Samoan: %s", greeting);

    expect(greeting).toBeNull();
  });

  it('insert new greeting in Samoan', async () => {
    await service.add_hello("ws", "alofa fiafia i le lalolagi!");

    let greeting = await service.say_hello("ws");
    console.log("In Samaon: %s", greeting);

    expect(greeting).toEqual("alofa fiafia i le lalolagi!");
  });

  afterAll(() => {
    oasis.disconnect();
  });
});
