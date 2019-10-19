const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.HelloWorld.deploy({
  header: {confidential: false},
})
  .then(res => {
    let addrHex = oasis.utils.bytes.toHex(res.address);
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
