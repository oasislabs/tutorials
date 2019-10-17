const chalk = require('chalk');
const oasis = require('@oasislabs/client');

oasis.workspace.Ballot.deploy('pokemon',  ['snorlax', 'gastly'], {
  header: {confidential: false},
})
  .then(res => {
    let addrHex = Buffer.from(res.address).toString('hex');
    console.log(`    ${chalk.green('Deployed')} Ballot at 0x${addrHex}`);
  })
  .catch(err => {
    console.error(
      `${chalk.red('error')}: could not deploy Ballot: ${err.message}`,
    );
  })
  .finally(() => {
    oasis.disconnect();
  });
