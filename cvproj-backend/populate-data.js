const dbHandler = require('./src/db-handler');
const dataHelper = require('./src/dataHelper');
const Cases = require('./models/case.model');

require('dotenv').config();
const fp = process.env.FILE_PATH;


dbHandler.connect()
    .then(async () => {

        await Cases.deleteMany();

        await dataHelper.insertCases(fp).then(async () => {
            console.log('close db');
            await dbHandler.closeDatabase();
        });
    })
    .catch((err) => {
        console.log(err);
    });

