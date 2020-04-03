const express = require('express');
const cors = require('cors');

const csvToJson = require('csvtojson');
const fs = require('file-system');

const casesRouter = require('./routes/cases');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions));
app.use(express.json());

app.use('/cases', casesRouter);

app.listen(port, () => {

    console.log('server running on port: ' + port);

});