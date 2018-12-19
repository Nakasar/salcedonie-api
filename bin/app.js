const config = require('./config/config');
const Api = require('../src/api')(config);

Api.listen(config.PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Up and running!');
});
