const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.RockPaperScissors.deploy({
  header: {confidential: false},
})
  .then(res => {
    let addrHex = Buffer.from(res.address).toString('hex');
    console.log(`    ${chalk.green('Deployed')} RockPaperScissors at 0x${addrHex}`);
  })
  .catch(err => {
    console.error(
      `${chalk.red('error')}: could not deploy RockPaperScissors: ${err.message}`,
    );
  })
  .finally(() => {
    oasis.disconnect();
  });
