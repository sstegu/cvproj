const express = require('express');
const cors = require('cors');
const casesRouter = require('../routes/cases');
let dbHandler = require('./db-handler');


let startServer = function (dbh) {
    console.log('hi there');

    let db = dbh === undefined || dbh === null ? dbHandler : dbh;

    require('dotenv').config();

    const app = express();
    const port = process.env.PORT || 5000;

    console.log("args: " + process.argv);

    var corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }

    db.connect();

    app.use(cors(corsOptions));
    app.use(express.json());

    app.use('/cases', casesRouter);

    app.on('listening', () => {
        console.log('server listening ***');
    });


    app.listen(port, () => {

        console.log('server running on port: ' + port);

    });

    return app;
};

exports.startServer = startServer;