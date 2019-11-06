const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.DiceGame.deploy(3, {
  header: {confidential: false},
})
  .then(res => {
    console.log(`    ${chalk.green('Deployed')} DiceGame at 0x${res.address.hex}`);
  })
  .catch(err => {
    console.error(chalk.red('error'), err);
  })
  .finally(() => {
    oasis.disconnect();
  });
