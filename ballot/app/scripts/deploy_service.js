const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.Ballot.deploy('pokemon',  ['snorlax', 'gastly'], {
  header: {confidential: false},
})
  .then(res => {
    console.log(`    ${chalk.green('Deployed')} Ballot at 0x${res.address.hex}`);
  })
  .catch(err => {
    console.error(
      `${chalk.red('error')}: could not deploy Ballot: ${err.message}`,
    );
  })
  .finally(() => {
    oasis.disconnect();
  });
