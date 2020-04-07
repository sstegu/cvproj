const request = require('supertest');
const app = require('../server');
const dataHelper = require('../src/dataHelper');
const testDbHandler = require('./db-handler');
const moment = require('moment');
let Case = require('../models/case.model');


//https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6

beforeAll(async () => {

    app.dbHandler = testDbHandler;
    await testDbHandler.connect();
    let newCase = new Case({
        'country': 'Canada',
        'region': 'Ontario',
        'lat': 55,
        'lng': 66,
        cases: [{
            'date': moment().toDate(),
            'number': 20
        },
        {
            'date': moment().subtract(1, 'days').toDate(),
            'number': 50
        }]
    });

    await newCase.save();

    newCase = new Case({
        'country': 'Canada',
        'region': 'Quebec',
        'lat': 55,
        'lng': 67,
        cases: [
            {
                'date': moment().subtract(1, 'days').format('M/D/YY'),
                'number': 30
            }, {
                'date': moment().format('M/D/YY'),
                'number': 50
            }]
    });

    await newCase.save();

});

afterAll(async () => {
    await testDbHandler.closeDatabase();
});


describe('get mongo data', () => {
    it('it should get data', async () => {
        const res = await request(app).get("/cases/Canada");
        expect(res.statusCode).toEqual(200);
        expect(res.body.length > 0).toBe(true);
        expect(res.body[0].cases.length === 2).toBe(true);
        console.log(res.body[0].cases);
    });
});