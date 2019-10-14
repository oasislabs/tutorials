const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.HelloWorld.deploy({
  header: {confidential: false},
})
  .then(res => {
    let addrHex = Buffer.from(res.address).toString('hex');
    console.log(`    ${chalk.green('Deployed')} HelloWorld at 0x${addrHex}`);
  })
  .catch(err => {
    console.error(
      `${chalk.red('error')}: could not deploy HelloWorld: ${err.message}`,
    );
  })
  .finally(() => {
    oasis.disconnect();
  });
