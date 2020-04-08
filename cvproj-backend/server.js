const myServer = require('./src/my-server');
const dataHelper = require('./src/dataHelper');

console.log(process.argv);

myServer.startServer(null);