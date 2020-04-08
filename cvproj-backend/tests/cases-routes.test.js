const request = require('supertest');
const testDbHandler = require('./db-handler');
const app = require('../server')(testDbHandler);
const dataHelper = require('../src/dataHelper');
const moment = require('moment');
let Case = require('../models/case.model');


//https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6

beforeAll(async () => {
    //swap out the real mongo connection with in memory mongo
    //app.dbHandler = testDbHandler;
    //connect to db and setup mock data
    await testDbHandler.connect();
    let newCase = new Case({
        'country': 'Canada',
        'region': 'Ontario',
        'lat': 55,
        'lng': 66,
        cases: [{
            'date': moment().startOf('day').toDate(),
            'number': 20
        },
        {
            'date': moment().subtract(1, 'days').startOf('day').toDate(),
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
                'date': moment().subtract(1, 'days').startOf('day').format('M/D/YY'),
                'number': 30
            }, {
                'date': moment().startOf('day').format('M/D/YY'),
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

    it('it should get mb data', async () => {

        const url1 = "/cases/mb/Canada/" + moment().startOf('day').format('M-D-YYYY');
        const url2 = "/cases/mb/Canada/" + moment().subtract(1, 'days').startOf('day').format('M-D-YYYY');
        console.log(url1);
        console.log(url2);
        const res1 = await request(app).get(url1);
        const res2 = await request(app).get(url2);
        expect(res1.statusCode).toEqual(200);
        expect(res2.statusCode).toEqual(200);
        console.log(res1.body);
        console.log(res2.body);
    }, 120000);
});