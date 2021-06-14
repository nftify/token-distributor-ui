const environment = process.env.REACT_APP_ENV ? process.env.REACT_APP_ENV : 'ropsten';
const ENV = require(`./envs/${environment}`);
module.exports = ENV;
