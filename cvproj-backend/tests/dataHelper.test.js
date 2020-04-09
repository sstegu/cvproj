const dataHelper = require('../src/dataHelper');
const dbHandler = require('./db-handler');
const moment = require('moment');
let cases = require('../models/case.model');

beforeAll(async () => {
    await dbHandler.connect();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});


describe('data helper tests', () => {

    it('creates array of dates', () => {

        var data = {
            'Province/State': '',
            'Country/Region': 'Afghanistan',
            Lat: '33.0',
            Long: '65.0',
            '1/22/20': '0',
            '1/23/20': '0'
        };

        let result = dataHelper.createCaseArray(data, moment('1/1/20'), moment('1/23/20'));
        console.log(result.length);
        expect(result.length === 2).toBe(true);
    });

    it('test insert data from file', async () => {

        await dataHelper.insertCases();
        let numCases = 0;

        await cases.estimatedDocumentCount((err, count) => {
            numCases = count;
        });

        expect(numCases > 0).toBe(true);

        let canCases = null;
        await cases.find({ country: 'Canada', region: 'Ontario' }, (err, res) => {
            expect(res.length === 1).toBe(true);
        });



    })
});



