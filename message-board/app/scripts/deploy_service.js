const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.MessageBoard.deploy({
  header: {confidential: false},
})
  .then(res => {
    let addrHex = Buffer.from(res._inner.address).toString('hex');
    console.log(`    ${chalk.green('Deployed')} MessageBoard at 0x${addrHex}`);
  })
  .catch(err => {
    console.error(
      `${chalk.red('error')}: could not deploy MessageBoard: ${err.message}`,
    );
  })
  .finally(() => {
    oasis.disconnect();
  });
