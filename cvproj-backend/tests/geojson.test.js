const moment = require('moment');
const GeoJSON = require('geojson');

const data = [{
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
},
{
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
}];

describe('geojson test', () => {

    it('creates geojson data', () => {
        const parsedData = GeoJSON.parse(data, { Point: ['lat', 'lng'] });
        console.log(parsedData);
        expect(parsedData !== undefined).toBe(true);
    });
});


