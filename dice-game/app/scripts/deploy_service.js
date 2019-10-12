const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.DiceGame.deploy(3, {
  header: {confidential: false},
})
  .then(res => {
    let addrHex = Buffer.from(res.address).toString('hex');
    console.log(`    ${chalk.green('Deployed')} DiceGame at 0x${addrHex}`);
  })
  .catch(err => {
    console.error(chalk.red('error'), err);
  })
  .finally(() => {
    oasis.disconnect();
  });
