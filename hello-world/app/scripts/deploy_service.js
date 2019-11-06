const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.HelloWorld.deploy({
  header: {confidential: false},
})
  .then(res => {
    console.log(`    ${chalk.green('Deployed')} HelloWorld at 0x${res.address.hex}`);
  })
  .catch(err => {
    console.error(
      `${chalk.red('error')}: could not deploy HelloWorld: ${err.message}`,
    );
  })
  .finally(() => {
    oasis.disconnect();
  });
