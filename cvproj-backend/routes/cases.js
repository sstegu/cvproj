const router = require('express').Router();
const csvToJson = require('csvtojson');
const moment = require('moment');

const FILE_PATH = process.env.FILE_PATH;

router.route('/:country').get(async (req, res) => {
    try {
        const result = await timeSeriesToJSON(req.params.country);
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json('error: ' + err);
    }
});

router.route('/mb/:country').get(async (req, res) => {
    try {
        const result = await timeSeriesToJSON(req.params.country);
        let features = [];
        result.forEach((elem, index) => {
            let start = moment().subtract(1, 'days');
            let end = moment();
            let numCases = 0;
            let id = elem['Country/Region'] + elem['Province/State'];
            while (start.isSameOrBefore(end)) {
                let caseDte = start.format('M/D/YY');
                let cases = elem[caseDte];
                if (cases !== undefined && cases > 0) {
                    numCases = numCases + Number.parseInt(cases);
                }
                start.add(1, 'days');
            }
            console.log(numCases);
            features.push({
                "type": "Feature", "properties": { "id": id + start.valueOf(), "cases": numCases },
                "geometry": { "type": "Point", "coordinates": [Number.parseFloat(elem['Long']), Number.parseFloat(elem['Lat'])] }
            });
        });

        res.json({
            "type": "FeatureCollection",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": features
        });
    } catch (err) {
        return res.status(400).json('error: ' + err);
    }
});

async function timeSeriesToJSON(country) {

    const jsonObj = await csvToJson().fromFile(FILE_PATH);
    return jsonObj.filter((elem) => {
        let country_region = elem['Country_Region'] || elem['Country/Region'];
        return country_region === country;
    });

}

function convertCsvToJson() {
    let cases = [];
    fs.recurse(FILE_PATH, ['*.csv'], (filepath, relative, filename) => {

        csvToJson().fromFile(filepath).then((jsonObj) => {
            let caCases = jsonObj.filter((elem) => {
                let country_region = elem['Country_Region'] || elem['Country/Region'];
                let prov = elem['Province/State'] || elem['Province_State'];
                //console.log(country_region);
                return (country_region === 'Canada' || country_region === 'CA') && prov === 'Ontario';
            });

            cases = [...cases, ...caCases];

            cases.forEach((val) => {
                console.log(val);
            });
        });

    });

}

export default router;